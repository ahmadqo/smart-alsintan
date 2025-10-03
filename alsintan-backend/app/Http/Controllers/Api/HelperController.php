<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Poktan;
use App\Models\Alsintan;
use App\Models\Kecamatan;
use App\Models\SmartCriteria;
use Illuminate\Http\Request;

class HelperController extends Controller
{
    /**
     * GET /api/poktan - Get list of active poktan
     */
    public function getPoktan(Request $request)
    {
        try {
            $kecamatanId = $request->get('kecamatan_id');
            $search = $request->get('search');

            $query = Poktan::with('kecamatan')->active();

            if ($kecamatanId) {
                $query->where('kecamatan_id', $kecamatanId);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_poktan', 'like', "%{$search}%")
                        ->orWhere('ketua_poktan', 'like', "%{$search}%");
                });
            }

            $poktan = $query->orderBy('nama_poktan')->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_poktan' => $item->nama_poktan,
                    'ketua_poktan' => $item->ketua_poktan,
                    'kecamatan' => $item->kecamatan->nama_kecamatan,
                    'jumlah_anggota' => $item->jumlah_anggota,
                    'luas_garapan' => $item->luas_garapan . ' ha',
                    'jenis_komoditas' => $item->jenis_komoditas,
                    'umur_poktan' => $item->umur_poktan . ' tahun'
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data poktan berhasil diambil',
                'data' => $poktan
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data poktan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/alsintan - Get list of alsintan
     */
    public function getAlsintan(Request $request)
    {
        try {
            $kategori = $request->get('kategori');
            $search = $request->get('search');

            $query = Alsintan::query();

            if ($kategori) {
                $query->where('kategori', $kategori);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_alsintan', 'like', "%{$search}%")
                        ->orWhere('kategori', 'like', "%{$search}%");
                });
            }

            $alsintan = $query->orderBy('nama_alsintan')->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_alsintan' => $item->nama_alsintan,
                    'kategori' => $item->kategori,
                    'spesifikasi' => $item->spesifikasi,
                    'harga_formatted' => $item->harga_formatted,
                    'satuan' => $item->satuan
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data alsintan berhasil diambil',
                'data' => $alsintan
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data alsintan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/kecamatan - Get list of kecamatan
     */
    public function getKecamatan(Request $request)
    {
        try {
            $kecamatan = Kecamatan::orderBy('nama_kecamatan')->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_kecamatan' => $item->nama_kecamatan,
                    'kode_kecamatan' => $item->kode_kecamatan,
                    'total_poktan' => $item->total_poktan,
                    'total_poktan_aktif' => $item->total_poktan_aktif
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data kecamatan berhasil diambil',
                'data' => $kecamatan
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data kecamatan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/smart-criteria - Get SMART criteria
     */
    public function getSmartCriteria()
    {
        try {
            $criteria = SmartCriteria::active()->ordered()->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_kriteria' => $item->nama_kriteria,
                    'deskripsi' => $item->deskripsi,
                    'bobot_persen' => $item->bobot_persen,
                    'tipe_data' => $item->tipe_data,
                    'nilai_min' => $item->nilai_min,
                    'nilai_max' => $item->nilai_max
                ];
            });

            $totalBobot = $criteria->sum('bobot_persen');

            return response()->json([
                'success' => true,
                'message' => 'Kriteria SMART berhasil diambil',
                'data' => [
                    'criteria' => $criteria,
                    'total_bobot' => $totalBobot,
                    'is_valid' => $totalBobot == 100
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil kriteria SMART',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}