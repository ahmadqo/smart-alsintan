<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DistribusiAlsintan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DistribusiController extends Controller
{
    public function index(Request $request)
    {
        try {
            $status = $request->get('status');
            $tanggalMulai = $request->get('tanggal_mulai');
            $tanggalSelesai = $request->get('tanggal_selesai');

            $query = DistribusiAlsintan::with(['pengajuan.poktan.kecamatan', 'pengajuan.alsintan', 'distributor']);

            if ($status) {
                $query->where('status_distribusi', $status);
            }

            if ($tanggalMulai) {
                $query->whereDate('tanggal_distribusi', '>=', $tanggalMulai);
            }

            if ($tanggalSelesai) {
                $query->whereDate('tanggal_distribusi', '<=', $tanggalSelesai);
            }

            $distribusi = $query->orderBy('tanggal_distribusi', 'desc')
                ->paginate(20)
                ->through(function ($item) {
                    return [
                        'id' => $item->id,
                        'pengajuan_id' => $item->pengajuan_id,
                        'poktan' => $item->pengajuan->poktan->nama_poktan,
                        'kecamatan' => $item->pengajuan->poktan->kecamatan->nama_kecamatan,
                        'alsintan' => $item->pengajuan->alsintan->nama_alsintan,
                        'jumlah_diterima' => $item->jumlah_diterima,
                        'tanggal_distribusi' => $item->tanggal_distribusi->format('d/m/Y'),
                        'lokasi_penyerahan' => $item->lokasi_penyerahan,
                        'status_distribusi' => $item->status_distribusi,
                        'status_badge' => $item->status_badge,
                        'distributor' => $item->distributor->nama ?? 'System',
                        'catatan' => $item->catatan
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Data distribusi berhasil diambil',
                'data' => $distribusi
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data distribusi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status_distribusi' => 'required|in:dalam_perjalanan,diserahkan,diterima',
            'catatan' => 'nullable|string|max:500',
            'lokasi_penyerahan' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi data gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $distribusi = DistribusiAlsintan::find($id);

            if (!$distribusi) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data distribusi tidak ditemukan'
                ], 404);
            }

            $distribusi->update([
                'status_distribusi' => $request->status_distribusi,
                'catatan' => $request->catatan,
                'lokasi_penyerahan' => $request->lokasi_penyerahan
            ]);

            // Update status pengajuan jika distribusi selesai
            if ($request->status_distribusi == 'diterima') {
                $distribusi->pengajuan->update([
                    'status_pengajuan' => 'terdistribusi'
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Status distribusi berhasil diperbarui',
                'data' => [
                    'id' => $distribusi->id,
                    'status_distribusi' => $distribusi->status_distribusi,
                    'status_badge' => $distribusi->status_badge,
                    'updated_at' => $distribusi->updated_at->format('d/m/Y H:i:s')
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui status distribusi',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}