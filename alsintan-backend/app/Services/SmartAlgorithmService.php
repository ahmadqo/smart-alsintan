<?php

namespace App\Services;

use App\Models\Pengajuan;
use App\Models\SmartCriteria;
use App\Models\SmartEvaluation;
use App\Models\RiwayatPenerimaan;
use Carbon\Carbon;

class SmartAlgorithmService
{
    public function calculateSmartScore($pengajuanId)
    {
        $pengajuan = Pengajuan::with('poktan', 'alsintan')->find($pengajuanId);
        $poktan = $pengajuan->poktan;
        $criteria = SmartCriteria::where('is_active', true)->get();

        $totalScore = 0;
        $evaluations = [];

        foreach ($criteria as $criterion) {
            $rawValue = $this->calculateCriterionValue($criterion, $poktan, $pengajuan);
            $normalizedValue = $this->normalizeValue($rawValue, $criterion);
            $weightedValue = $normalizedValue * ($criterion->bobot_persen / 100);

            // Simpan evaluasi detail
            $evaluation = SmartEvaluation::create([
                'pengajuan_id' => $pengajuanId,
                'criteria_id' => $criterion->id,
                'nilai_raw' => $rawValue,
                'nilai_normalized' => $normalizedValue,
                'nilai_weighted' => $weightedValue,
                'catatan_evaluasi' => $this->generateEvaluationNote($criterion, $rawValue)
            ]);

            $totalScore += $weightedValue;
            $evaluations[] = $evaluation;
        }

        // Update skor SMART pada pengajuan
        $pengajuan->update(['smart_score' => $totalScore]);

        // Update ranking semua pengajuan
        $this->updateRankings();

        return [
            'total_score' => $totalScore,
            'evaluations' => $evaluations
        ];
    }

    private function calculateCriterionValue($criterion, $poktan, $pengajuan)
    {
        switch ($criterion->nama_kriteria) {
            case 'Riwayat Penerimaan':
                return $this->calculateRiwayatScore($poktan->id);

            case 'Jumlah Anggota':
                return $this->calculateJumlahAnggotaScore($poktan->jumlah_anggota);

            case 'Luas Garapan':
                return $this->calculateLuasGarapanScore($poktan->luas_garapan);

            case 'Umur Poktan':
                return $this->calculateUmurPoktanScore($poktan->tahun_pembentukan);

            case 'Kesesuaian Alsintan':
                return $this->calculateKesesuaianScore($poktan, $pengajuan->alsintan);

            default:
                return 0;
        }
    }

    private function calculateRiwayatScore($poktanId)
    {
        $lastReceived = RiwayatPenerimaan::where('poktan_id', $poktanId)
            ->orderBy('tanggal_penerimaan', 'desc')
            ->first();

        if (!$lastReceived) {
            return 100; // Belum pernah menerima = skor tertinggi
        }

        $yearsSinceLastReceived = Carbon::parse($lastReceived->tanggal_penerimaan)
            ->diffInYears(Carbon::now());

        // Semakin lama tidak menerima = skor semakin tinggi
        // Max 5 tahun
        return min(($yearsSinceLastReceived / 5) * 100, 100);
    }

    private function calculateJumlahAnggotaScore($jumlahAnggota)
    {
        // Normalisasi berdasarkan jumlah anggota maksimal (misal 50)
        $maxAnggota = 50;
        return min(($jumlahAnggota / $maxAnggota) * 100, 100);
    }

    private function calculateLuasGarapanScore($luasGarapan)
    {
        // Normalisasi berdasarkan luas maksimal (misal 20 hektar)
        $maxLuas = 20;
        return min(($luasGarapan / $maxLuas) * 100, 100);
    }

    private function calculateUmurPoktanScore($tahunPembentukan)
    {
        $umurPoktan = Carbon::now()->year - $tahunPembentukan;
        // Semakin lama berdiri = semakin berpengalaman = skor tinggi
        // Max 10 tahun
        return min(($umurPoktan / 10) * 100, 100);
    }

    private function calculateKesesuaianScore($poktan, $alsintan)
    {
        // Matrix kesesuaian jenis alsintan dengan komoditas
        $compatibilityMatrix = [
            'Padi' => ['Traktor', 'Rice Transplanter', 'Combine Harvester', 'Rice Milling'],
            'Jagung' => ['Traktor', 'Seeder', 'Cultivator', 'Corn Sheller'],
            'Kedelai' => ['Traktor', 'Seeder', 'Cultivator', 'Thresher'],
            'Sayuran' => ['Hand Tractor', 'Water Pump', 'Sprayer'],
        ];

        $komoditas = $poktan->jenis_komoditas;
        $jenisAlsintan = $alsintan->kategori;

        if (
            isset($compatibilityMatrix[$komoditas]) &&
            in_array($jenisAlsintan, $compatibilityMatrix[$komoditas])
        ) {
            return 100; // Sangat sesuai
        }

        return 50; // Kurang sesuai tapi masih bisa digunakan
    }

    private function normalizeValue($rawValue, $criterion)
    {
        // Normalisasi ke skala 0-1
        $range = $criterion->nilai_max - $criterion->nilai_min;
        if ($range == 0)
            return 1;

        return ($rawValue - $criterion->nilai_min) / $range;
    }

    private function updateRankings()
    {
        $pengajuans = Pengajuan::where('status_pengajuan', 'pending')
            ->orderBy('smart_score', 'desc')
            ->get();

        foreach ($pengajuans as $index => $pengajuan) {
            $pengajuan->update(['ranking_prioritas' => $index + 1]);
        }
    }

    private function generateEvaluationNote($criterion, $rawValue)
    {
        switch ($criterion->nama_kriteria) {
            case 'Riwayat Penerimaan':
                if ($rawValue == 100) {
                    return 'Poktan belum pernah menerima bantuan alsintan';
                } else {
                    $years = round((($rawValue / 100) * 5), 1);
                    return "Terakhir menerima bantuan {$years} tahun yang lalu";
                }

            case 'Jumlah Anggota':
                $anggota = round((($rawValue / 100) * 50));
                return "Poktan memiliki {$anggota} anggota aktif";

            case 'Luas Garapan':
                $luas = round((($rawValue / 100) * 20), 1);
                return "Total luas garapan {$luas} hektar";

            case 'Umur Poktan':
                $umur = round((($rawValue / 100) * 10));
                return "Poktan telah berdiri selama {$umur} tahun";

            case 'Kesesuaian Alsintan':
                return $rawValue == 100 ? 'Alsintan sangat sesuai dengan komoditas' : 'Alsintan cukup sesuai';

            default:
                return 'Evaluasi otomatis sistem SMART';
        }
    }

    public function getRecommendations($limit = 10)
    {
        return Pengajuan::with(['poktan.kecamatan', 'alsintan', 'smartEvaluations.criteria'])
            ->where('status_pengajuan', 'pending')
            ->orderBy('smart_score', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($pengajuan) {
                return [
                    'id' => $pengajuan->id,
                    'poktan' => $pengajuan->poktan->nama_poktan,
                    'kecamatan' => $pengajuan->poktan->kecamatan->nama_kecamatan,
                    'alsintan' => $pengajuan->alsintan->nama_alsintan,
                    'smart_score' => round($pengajuan->smart_score, 2),
                    'ranking' => $pengajuan->ranking_prioritas,
                    'detail_evaluasi' => $pengajuan->smartEvaluations->map(function ($eval) {
                        return [
                            'kriteria' => $eval->criteria->nama_kriteria,
                            'nilai_raw' => $eval->nilai_raw,
                            'nilai_normalized' => round($eval->nilai_normalized, 3),
                            'bobot' => $eval->criteria->bobot_persen . '%',
                            'nilai_weighted' => round($eval->nilai_weighted, 3),
                            'catatan' => $eval->catatan_evaluasi
                        ];
                    })
                ];
            });
    }
}
