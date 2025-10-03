<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DistribusiAlsintan;
use App\Models\Pengajuan;
use App\Models\RiwayatPenerimaan;
use App\Services\SmartAlgorithmService;
use DB;
use Illuminate\Http\Request;
use Validator;

class PengajuanController extends Controller
{
    protected $smartService;

    public function __construct(SmartAlgorithmService $smartService)
    {
        $this->smartService = $smartService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * POST /api/pengajuan - Input pengajuan baru (otomatis hitung SMART)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'poktan_id' => 'required|exists:poktan,id',
            'alsintan_id' => 'required|exists:alsintan,id',
            'jumlah_diminta' => 'required|integer|min:1',
            'alasan_pengajuan' => 'required|string|max:1000',
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
            // Cek apakah poktan sudah mengajukan alsintan yang sama dan belum selesai
            $existingPengajuan = Pengajuan::where('poktan_id', $request->poktan_id)
                ->where('alsintan_id', $request->alsintan_id)
                ->whereIn('status_pengajuan', ['pending', 'disetujui'])
                ->first();

            if ($existingPengajuan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Poktan sudah memiliki pengajuan untuk alsintan ini yang belum selesai'
                ], 400);
            }

            // Buat pengajuan baru
            $pengajuan = Pengajuan::create([
                'poktan_id' => $request->poktan_id,
                'alsintan_id' => $request->alsintan_id,
                'jumlah_diminta' => $request->jumlah_diminta,
                'alasan_pengajuan' => $request->alasan_pengajuan,
                'status_pengajuan' => 'pending',
                'tanggal_pengajuan' => now(),
                'created_by' => auth()->id() ?? 1, // Default admin ID
            ]);

            // Hitung skor SMART otomatis
            $smartResult = $this->smartService->calculateSmartScore($pengajuan->id);

            // Load data lengkap untuk response
            $pengajuan->load(['poktan.kecamatan', 'alsintan']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan berhasil dibuat dan skor SMART telah dihitung',
                'data' => [
                    'pengajuan' => [
                        'id' => $pengajuan->id,
                        'poktan' => $pengajuan->poktan->nama_poktan,
                        'kecamatan' => $pengajuan->poktan->kecamatan->nama_kecamatan,
                        'alsintan' => $pengajuan->alsintan->nama_alsintan,
                        'jumlah_diminta' => $pengajuan->jumlah_diminta,
                        'alasan_pengajuan' => $pengajuan->alasan_pengajuan,
                        'tanggal_pengajuan' => $pengajuan->tanggal_pengajuan->format('Y-m-d'),
                        'smart_score' => round($pengajuan->smart_score, 2),
                        'ranking_prioritas' => $pengajuan->ranking_prioritas,
                        'status_pengajuan' => $pengajuan->status_pengajuan,
                    ],
                    'smart_calculation' => $smartResult
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan pengajuan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function approvePengajuan(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'catatan_persetujuan' => 'nullable|string|max:500',
            'jumlah_disetujui' => 'required|integer|min:1',
            'tanggal_distribusi' => 'required|date|after_or_equal:today'
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
            $pengajuan = Pengajuan::with(['poktan', 'alsintan'])->find($id);

            if (!$pengajuan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pengajuan tidak ditemukan'
                ], 404);
            }

            if ($pengajuan->status_pengajuan !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Pengajuan sudah diproses sebelumnya'
                ], 400);
            }

            // Update pengajuan
            $pengajuan->update([
                'status_pengajuan' => 'disetujui',
                'tanggal_persetujuan_dinas' => now(),
                'catatan_verifikasi' => $request->catatan_persetujuan
            ]);

            // Buat record distribusi
            $distribusi = DistribusiAlsintan::create([
                'pengajuan_id' => $pengajuan->id,
                'jumlah_diterima' => $request->jumlah_disetujui,
                'tanggal_distribusi' => $request->tanggal_distribusi,
                'status_distribusi' => 'dalam_perjalanan',
                'distributed_by' => auth()->id() ?? 1
            ]);

            // Tambah ke riwayat penerimaan
            RiwayatPenerimaan::create([
                'poktan_id' => $pengajuan->poktan->id,
                'alsintan_id' => $pengajuan->alsintan->id,
                'jumlah_diterima' => $request->jumlah_disetujui,
                'tanggal_penerimaan' => $request->tanggal_distribusi,
                'tahun_anggaran' => date('Y'),
                'nilai_bantuan' => $pengajuan->alsintan->harga_satuan * $request->jumlah_disetujui
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan berhasil disetujui',
                'data' => [
                    'pengajuan' => [
                        'id' => $pengajuan->id,
                        'poktan' => $pengajuan->poktan->nama_poktan,
                        'alsintan' => $pengajuan->alsintan->nama_alsintan,
                        'status' => $pengajuan->status_pengajuan,
                        'smart_score' => $pengajuan->smart_score
                    ],
                    'distribusi' => [
                        'id' => $distribusi->id,
                        'jumlah_diterima' => $distribusi->jumlah_diterima,
                        'tanggal_distribusi' => $distribusi->tanggal_distribusi->format('d/m/Y'),
                        'status' => $distribusi->status_distribusi
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyetujui pengajuan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
