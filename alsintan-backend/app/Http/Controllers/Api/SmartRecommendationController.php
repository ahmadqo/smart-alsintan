<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengajuan;
use App\Models\RiwayatPenerimaan;
use App\Models\SmartCriteria;
use App\Models\SmartEvaluation;
use App\Services\SmartAlgorithmService;
use Illuminate\Http\Request;
use Validator;

class SmartRecommendationController extends Controller
{
    protected $smartService;

    public function __construct(SmartAlgorithmService $smartService)
    {
        $this->smartService = $smartService;
    }

    /**
     * GET /api/rekomendasi-prioritas - Ambil daftar prioritas berdasarkan ranking
     */
    public function getRecommendations(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'limit' => 'integer|min:1|max:100',
            'status' => 'in:pending,disetujui,ditolak,terdistribusi',
            'kecamatan_id' => 'exists:kecamatan,id',
            'alsintan_id' => 'exists:alsintan,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Parameter tidak valid',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $limit = $request->get('limit', 20);
            $status = $request->get('status', 'pending');
            $kecamatanId = $request->get('kecamatan_id');
            $alsintanId = $request->get('alsintan_id');

            $query = Pengajuan::with(['poktan.kecamatan', 'alsintan'])
                ->where('status_pengajuan', $status)
                ->whereNotNull('smart_score');

            if ($kecamatanId) {
                $query->whereHas('poktan', function ($q) use ($kecamatanId) {
                    $q->where('kecamatan_id', $kecamatanId);
                });
            }

            if ($alsintanId) {
                $query->where('alsintan_id', $alsintanId);
            }

            $recommendations = $query->orderBy('smart_score', 'desc')
                ->orderBy('tanggal_pengajuan', 'asc')
                ->limit($limit)
                ->get();

            $formattedRecommendations = $recommendations->map(function ($pengajuan, $index) {
                return [
                    'id' => $pengajuan->id,
                    'ranking' => $index + 1,
                    'poktan' => [
                        'id' => $pengajuan->poktan->id,
                        'nama' => $pengajuan->poktan->nama_poktan,
                        'ketua' => $pengajuan->poktan->ketua_poktan,
                        'kecamatan' => $pengajuan->poktan->kecamatan->nama_kecamatan,
                        'jumlah_anggota' => $pengajuan->poktan->jumlah_anggota,
                        'luas_garapan' => $pengajuan->poktan->luas_garapan . ' ha'
                    ],
                    'alsintan' => [
                        'id' => $pengajuan->alsintan->id,
                        'nama' => $pengajuan->alsintan->nama_alsintan,
                        'kategori' => $pengajuan->alsintan->kategori
                    ],
                    'jumlah_diminta' => $pengajuan->jumlah_diminta,
                    'tanggal_pengajuan' => $pengajuan->tanggal_pengajuan->format('d/m/Y'),
                    'smart_score' => round($pengajuan->smart_score, 2),
                    'status' => $pengajuan->status_pengajuan,
                    'alasan_pengajuan' => $pengajuan->alasan_pengajuan
                ];
            });

            // Hitung statistik
            $stats = [
                'total_pengajuan' => $recommendations->count(),
                'rata_rata_score' => $recommendations->avg('smart_score') ? round($recommendations->avg('smart_score'), 2) : 0,
                'score_tertinggi' => $recommendations->max('smart_score') ? round($recommendations->max('smart_score'), 2) : 0,
                'score_terendah' => $recommendations->min('smart_score') ? round($recommendations->min('smart_score'), 2) : 0
            ];

            return response()->json([
                'success' => true,
                'message' => 'Rekomendasi prioritas berhasil diambil',
                'data' => [
                    'recommendations' => $formattedRecommendations,
                    'statistics' => $stats,
                    'filters' => [
                        'status' => $status,
                        'kecamatan_id' => $kecamatanId,
                        'alsintan_id' => $alsintanId,
                        'limit' => $limit
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil rekomendasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/smart-detail/{id} - Detail perhitungan SMART per pengajuan
     */
    public function getSmartDetail($id)
    {
        try {
            $pengajuan = Pengajuan::with([
                'poktan.kecamatan',
                'alsintan',
                'smartEvaluations.criteria'
            ])->find($id);

            if (!$pengajuan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pengajuan tidak ditemukan'
                ], 404);
            }

            if (!$pengajuan->smart_score) {
                return response()->json([
                    'success' => false,
                    'message' => 'Skor SMART belum dihitung untuk pengajuan ini'
                ], 400);
            }

            // Format detail pengajuan
            $pengajuanDetail = [
                'id' => $pengajuan->id,
                'poktan' => [
                    'nama' => $pengajuan->poktan->nama_poktan,
                    'ketua' => $pengajuan->poktan->ketua_poktan,
                    'kecamatan' => $pengajuan->poktan->kecamatan->nama_kecamatan,
                    'alamat' => $pengajuan->poktan->alamat,
                    'jumlah_anggota' => $pengajuan->poktan->jumlah_anggota,
                    'luas_garapan' => $pengajuan->poktan->luas_garapan,
                    'jenis_komoditas' => $pengajuan->poktan->jenis_komoditas,
                    'tahun_pembentukan' => $pengajuan->poktan->tahun_pembentukan
                ],
                'alsintan' => [
                    'nama' => $pengajuan->alsintan->nama_alsintan,
                    'kategori' => $pengajuan->alsintan->kategori,
                    'spesifikasi' => $pengajuan->alsintan->spesifikasi
                ],
                'pengajuan' => [
                    'jumlah_diminta' => $pengajuan->jumlah_diminta,
                    'alasan_pengajuan' => $pengajuan->alasan_pengajuan,
                    'tanggal_pengajuan' => $pengajuan->tanggal_pengajuan->format('d/m/Y'),
                    'status' => $pengajuan->status_pengajuan
                ]
            ];

            // Format detail evaluasi SMART
            $evaluasiDetail = $pengajuan->smartEvaluations->map(function ($evaluation) use ($pengajuan) {
                return [
                    'kriteria' => $evaluation->criteria->nama_kriteria,
                    'bobot' => $evaluation->criteria->bobot_persen . '%',
                    'nilai_raw' => $evaluation->nilai_raw,
                    'nilai_normalized' => round($evaluation->nilai_normalized, 4),
                    'nilai_weighted' => round($evaluation->nilai_weighted, 4),
                    'kontribusi_persen' => round(($evaluation->nilai_weighted / max($pengajuan->smart_score, 0.01)) * 100, 1) . '%',
                    'catatan_evaluasi' => $evaluation->catatan_evaluasi,
                    'tanggal_evaluasi' => $evaluation->created_at->format('d/m/Y H:i')
                ];
            });

            // Riwayat penerimaan poktan
            $riwayatPenerimaan = RiwayatPenerimaan::with('alsintan')
                ->where('poktan_id', $pengajuan->poktan->id)
                ->orderBy('tanggal_penerimaan', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($riwayat) {
                    return [
                        'alsintan' => $riwayat->alsintan->nama_alsintan,
                        'jumlah_diterima' => $riwayat->jumlah_diterima,
                        'tanggal_penerimaan' => $riwayat->tanggal_penerimaan->format('d/m/Y'),
                        'tahun_anggaran' => $riwayat->tahun_anggaran,
                        'nilai_bantuan' => 'Rp ' . number_format($riwayat->nilai_bantuan, 0, ',', '.')
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Detail perhitungan SMART berhasil diambil',
                'data' => [
                    'pengajuan_detail' => $pengajuanDetail,
                    'smart_score' => round($pengajuan->smart_score, 4),
                    'ranking_prioritas' => $pengajuan->ranking_prioritas,
                    'evaluasi_detail' => $evaluasiDetail,
                    'total_kriteria' => $evaluasiDetail->count(),
                    'riwayat_penerimaan' => $riwayatPenerimaan,
                    'summary' => [
                        'total_bobot_digunakan' => $evaluasiDetail->sum(function ($item) {
                            return floatval(str_replace('%', '', $item['bobot']));
                        }) . '%',
                        'kontribusi_terbesar' => $evaluasiDetail->sortByDesc('nilai_weighted')->first()['kriteria'] ?? '',
                        'rekomendasi' => $pengajuan->smart_score >= 0.7 ? 'Sangat Direkomendasikan' :
                            ($pengajuan->smart_score >= 0.5 ? 'Direkomendasikan' : 'Kurang Direkomendasikan')
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil detail SMART',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * PUT /api/smart-criteria - Update bobot kriteria
     */
    public function updateCriteria(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'criteria' => 'required|array',
            'criteria.*.id' => 'required|exists:smart_criteria,id',
            'criteria.*.bobot_persen' => 'required|numeric|min:0|max:100',
            'recalculate_all' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi data gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Validasi total bobot harus 100%
        $totalBobot = collect($request->criteria)->sum('bobot_persen');
        if ($totalBobot != 100) {
            return response()->json([
                'success' => false,
                'message' => 'Total bobot semua kriteria harus 100%',
                'current_total' => $totalBobot
            ], 400);
        }

        DB::beginTransaction();

        try {
            $updatedCriteria = [];

            foreach ($request->criteria as $criteriaData) {
                $criteria = SmartCriteria::find($criteriaData['id']);
                $oldBobot = $criteria->bobot_persen;

                $criteria->update([
                    'bobot_persen' => $criteriaData['bobot_persen']
                ]);

                $updatedCriteria[] = [
                    'id' => $criteria->id,
                    'nama_kriteria' => $criteria->nama_kriteria,
                    'bobot_lama' => $oldBobot . '%',
                    'bobot_baru' => $criteriaData['bobot_persen'] . '%',
                    'perubahan' => round($criteriaData['bobot_persen'] - $oldBobot, 1) . '%'
                ];
            }

            // Recalculate semua skor SMART jika diminta
            if ($request->get('recalculate_all', false)) {
                $pengajuansPending = Pengajuan::where('status_pengajuan', 'pending')
                    ->whereNotNull('smart_score')
                    ->get();

                $recalculatedCount = 0;
                foreach ($pengajuansPending as $pengajuan) {
                    $this->smartService->calculateSmartScore($pengajuan->id);
                    $recalculatedCount++;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Bobot kriteria berhasil diperbarui',
                'data' => [
                    'updated_criteria' => $updatedCriteria,
                    'total_bobot' => $totalBobot . '%',
                    'recalculated_pengajuan' => $recalculatedCount ?? 0,
                    'updated_at' => now()->format('d/m/Y H:i:s')
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui kriteria',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/dashboard-smart - Statistik dan grafik berbasis SMART score
     */
    public function getDashboardSmart(Request $request)
    {
        try {
            $tahun = $request->get('tahun', date('Y'));
            $bulan = $request->get('bulan');

            // Query base untuk filter
            $query = Pengajuan::with(['poktan.kecamatan', 'alsintan'])
                ->whereYear('tanggal_pengajuan', $tahun);

            if ($bulan) {
                $query->whereMonth('tanggal_pengajuan', $bulan);
            }

            // 1. Statistik Umum
            $totalPengajuan = $query->count();
            $totalPending = $query->where('status_pengajuan', 'pending')->count();
            $totalDisetujui = $query->where('status_pengajuan', 'disetujui')->count();
            $totalTerdistribusi = $query->where('status_pengajuan', 'terdistribusi')->count();
            $rataRataSkor = $query->whereNotNull('smart_score')->avg('smart_score');

            // 2. Distribusi Skor SMART
            $distribusiSkor = $query->whereNotNull('smart_score')
                ->get()
                ->groupBy(function ($item) {
                    $score = $item->smart_score;
                    if ($score >= 0.8)
                        return 'Sangat Tinggi (0.8-1.0)';
                    if ($score >= 0.6)
                        return 'Tinggi (0.6-0.8)';
                    if ($score >= 0.4)
                        return 'Sedang (0.4-0.6)';
                    if ($score >= 0.2)
                        return 'Rendah (0.2-0.4)';
                    return 'Sangat Rendah (0-0.2)';
                })
                ->map(function ($group) {
                    return $group->count();
                });

            // 3. Top 10 Poktan dengan Skor Tertinggi
            $topPoktan = $query->whereNotNull('smart_score')
                ->orderBy('smart_score', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($pengajuan, $index) {
                    return [
                        'ranking' => $index + 1,
                        'nama_poktan' => $pengajuan->poktan->nama_poktan,
                        'kecamatan' => $pengajuan->poktan->kecamatan->nama_kecamatan,
                        'alsintan' => $pengajuan->alsintan->nama_alsintan,
                        'smart_score' => round($pengajuan->smart_score, 3),
                        'status' => $pengajuan->status_pengajuan
                    ];
                });

            // 4. Statistik per Kecamatan
            $statsPerKecamatan = $query->whereNotNull('smart_score')
                ->get()
                ->groupBy('poktan.kecamatan.nama_kecamatan')
                ->map(function ($group, $kecamatan) {
                    return [
                        'kecamatan' => $kecamatan,
                        'total_pengajuan' => $group->count(),
                        'rata_rata_skor' => round($group->avg('smart_score'), 3),
                        'skor_tertinggi' => round($group->max('smart_score'), 3),
                        'pending' => $group->where('status_pengajuan', 'pending')->count(),
                        'disetujui' => $group->where('status_pengajuan', 'disetujui')->count(),
                        'terdistribusi' => $group->where('status_pengajuan', 'terdistribusi')->count()
                    ];
                })
                ->values()
                ->sortByDesc('rata_rata_skor');

            // 5. Trend Pengajuan per Bulan
            $trendBulanan = [];
            for ($i = 1; $i <= 12; $i++) {
                $pengajuanBulan = Pengajuan::whereYear('tanggal_pengajuan', $tahun)
                    ->whereMonth('tanggal_pengajuan', $i)
                    ->whereNotNull('smart_score');

                $trendBulanan[] = [
                    'bulan' => $i,
                    'nama_bulan' => date('F', mktime(0, 0, 0, $i, 1)),
                    'total_pengajuan' => $pengajuanBulan->count(),
                    'rata_rata_skor' => round($pengajuanBulan->avg('smart_score') ?? 0, 3),
                    'pending' => $pengajuanBulan->where('status_pengajuan', 'pending')->count(),
                    'disetujui' => $pengajuanBulan->where('status_pengajuan', 'disetujui')->count(),
                    'terdistribusi' => $pengajuanBulan->where('status_pengajuan', 'terdistribusi')->count()
                ];
            }

            // 6. Analisis Kriteria
            $analisisKriteria = SmartCriteria::where('is_active', true)
                ->get()
                ->map(function ($criteria) use ($query) {
                    $evaluations = SmartEvaluation::whereHas('pengajuan', function ($q) use ($query) {
                        $q->whereIn('id', $query->pluck('id'));
                    })->where('criteria_id', $criteria->id);

                    return [
                        'nama_kriteria' => $criteria->nama_kriteria,
                        'bobot' => $criteria->bobot_persen . '%',
                        'rata_rata_kontribusi' => round($evaluations->avg('nilai_weighted') ?? 0, 4),
                        'kontribusi_tertinggi' => round($evaluations->max('nilai_weighted') ?? 0, 4),
                        'kontribusi_terendah' => round($evaluations->min('nilai_weighted') ?? 0, 4),
                        'total_evaluasi' => $evaluations->count()
                    ];
                });

            // 7. Rekomendasi Aksi
            $rekomendasiAksi = [];

            $highScorePending = $query->where('status_pengajuan', 'pending')
                ->where('smart_score', '>=', 0.7)
                ->count();

            if ($highScorePending > 0) {
                $rekomendasiAksi[] = "Ada {$highScorePending} pengajuan dengan skor tinggi yang perlu segera ditindaklanjuti";
            }

            $lowScorePending = $query->where('status_pengajuan', 'pending')
                ->where('smart_score', '<', 0.3)
                ->count();

            if ($lowScorePending > 0) {
                $rekomendasiAksi[] = "Ada {$lowScorePending} pengajuan dengan skor rendah yang perlu evaluasi ulang";
            }

            return response()->json([
                'success' => true,
                'message' => 'Dashboard SMART berhasil diambil',
                'data' => [
                    'periode' => [
                        'tahun' => $tahun,
                        'bulan' => $bulan,
                        'generated_at' => now()->format('d/m/Y H:i:s')
                    ],
                    'statistik_umum' => [
                        'total_pengajuan' => $totalPengajuan,
                        'total_pending' => $totalPending,
                        'total_disetujui' => $totalDisetujui,
                        'total_terdistribusi' => $totalTerdistribusi,
                        'rata_rata_skor' => round($rataRataSkor ?? 0, 3),
                        'persentase_disetujui' => $totalPengajuan > 0 ? round(($totalDisetujui / $totalPengajuan) * 100, 1) . '%' : '0%'
                    ],
                    'distribusi_skor' => $distribusiSkor,
                    'top_poktan' => $topPoktan,
                    'stats_per_kecamatan' => $statsPerKecamatan->take(10),
                    'trend_bulanan' => $trendBulanan,
                    'analisis_kriteria' => $analisisKriteria,
                    'rekomendasi_aksi' => $rekomendasiAksi,
                    'charts_data' => [
                        'pie_status' => [
                            ['name' => 'Pending', 'value' => $totalPending],
                            ['name' => 'Disetujui', 'value' => $totalDisetujui],
                            ['name' => 'Terdistribusi', 'value' => $totalTerdistribusi]
                        ],
                        'bar_kecamatan' => $statsPerKecamatan->take(5)->map(function ($item) {
                            return [
                                'kecamatan' => $item['kecamatan'],
                                'pengajuan' => $item['total_pengajuan'],
                                'rata_skor' => $item['rata_rata_skor']
                            ];
                        })->values(),
                        'line_trend' => $trendBulanan
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil dashboard SMART',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function recalculateScores(Request $request, $id = null)
    {
        try {
            if ($id) {
                // Recalculate specific pengajuan
                $pengajuan = Pengajuan::find($id);
                if (!$pengajuan) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Pengajuan tidak ditemukan'
                    ], 404);
                }

                $result = $this->smartService->calculateSmartScore($id);

                return response()->json([
                    'success' => true,
                    'message' => 'Skor SMART berhasil dihitung ulang',
                    'data' => [
                        'pengajuan_id' => $id,
                        'smart_score' => $result['total_score'],
                        'evaluations' => $result['evaluations']
                    ]
                ]);

            } else {
                // Recalculate all pending pengajuan
                $pengajuans = Pengajuan::where('status_pengajuan', 'pending')->get();
                $recalculatedCount = 0;
                $errors = [];

                foreach ($pengajuans as $pengajuan) {
                    try {
                        $this->smartService->calculateSmartScore($pengajuan->id);
                        $recalculatedCount++;
                    } catch (\Exception $e) {
                        $errors[] = "Error pengajuan ID {$pengajuan->id}: " . $e->getMessage();
                    }
                }

                return response()->json([
                    'success' => true,
                    'message' => "Berhasil menghitung ulang {$recalculatedCount} pengajuan",
                    'data' => [
                        'total_processed' => $pengajuans->count(),
                        'success_count' => $recalculatedCount,
                        'error_count' => count($errors),
                        'errors' => $errors
                    ]
                ]);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menghitung ulang skor SMART',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
