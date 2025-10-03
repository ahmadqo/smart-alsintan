<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengajuan;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function getSummaryReport(Request $request)
    {
        try {
            $tahun = $request->get('tahun', date('Y'));
            $kecamatanId = $request->get('kecamatan_id');

            $baseQuery = Pengajuan::with(['poktan.kecamatan', 'alsintan'])
                ->whereYear('tanggal_pengajuan', $tahun);

            if ($kecamatanId) {
                $baseQuery->whereHas('poktan', function ($q) use ($kecamatanId) {
                    $q->where('kecamatan_id', $kecamatanId);
                });
            }

            // Summary Statistics
            $summary = [
                'total_pengajuan' => $baseQuery->count(),
                'total_pending' => $baseQuery->where('status_pengajuan', 'pending')->count(),
                'total_disetujui' => $baseQuery->where('status_pengajuan', 'disetujui')->count(),
                'total_ditolak' => $baseQuery->where('status_pengajuan', 'ditolak')->count(),
                'total_terdistribusi' => $baseQuery->where('status_pengajuan', 'terdistribusi')->count(),
                'rata_rata_smart_score' => round($baseQuery->whereNotNull('smart_score')->avg('smart_score') ?? 0, 3)
            ];

            // Top 5 Poktan dengan Skor Tertinggi
            $topPoktan = $baseQuery->whereNotNull('smart_score')
                ->orderBy('smart_score', 'desc')
                ->limit(5)
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

            // Distribusi per Kecamatan
            $distribusiKecamatan = $baseQuery->get()
                ->groupBy('poktan.kecamatan.nama_kecamatan')
                ->map(function ($group, $kecamatan) {
                    return [
                        'kecamatan' => $kecamatan,
                        'total_pengajuan' => $group->count(),
                        'pending' => $group->where('status_pengajuan', 'pending')->count(),
                        'disetujui' => $group->where('status_pengajuan', 'disetujui')->count(),
                        'terdistribusi' => $group->where('status_pengajuan', 'terdistribusi')->count(),
                        'rata_rata_score' => round($group->whereNotNull('smart_score')->avg('smart_score') ?? 0, 3)
                    ];
                })
                ->values();

            // Alsintan Paling Diminta
            $alsintanPopuler = $baseQuery->get()
                ->groupBy('alsintan.nama_alsintan')
                ->map(function ($group, $alsintan) {
                    return [
                        'nama_alsintan' => $alsintan,
                        'total_permintaan' => $group->count(),
                        'total_unit_diminta' => $group->sum('jumlah_diminta'),
                        'total_disetujui' => $group->whereIn('status_pengajuan', ['disetujui', 'terdistribusi'])->count()
                    ];
                })
                ->sortByDesc('total_permintaan')
                ->values()
                ->take(5);

            return response()->json([
                'success' => true,
                'message' => 'Laporan ringkasan berhasil diambil',
                'data' => [
                    'periode' => [
                        'tahun' => $tahun,
                        'kecamatan_id' => $kecamatanId,
                        'generated_at' => now()->format('d/m/Y H:i:s')
                    ],
                    'summary' => $summary,
                    'top_poktan' => $topPoktan,
                    'distribusi_kecamatan' => $distribusiKecamatan,
                    'alsintan_populer' => $alsintanPopuler,
                    'performance_metrics' => [
                        'tingkat_persetujuan' => $summary['total_pengajuan'] > 0 ?
                            round(($summary['total_disetujui'] + $summary['total_terdistribusi']) / $summary['total_pengajuan'] * 100, 1) . '%' : '0%',
                        'tingkat_distribusi' => $summary['total_disetujui'] > 0 ?
                            round($summary['total_terdistribusi'] / $summary['total_disetujui'] * 100, 1) . '%' : '0%'
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil laporan ringkasan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function exportExcel(Request $request)
    {
        // Implementation for Excel export
        // You would typically use Laravel Excel package here

        return response()->json([
            'success' => true,
            'message' => 'Export Excel akan segera tersedia',
            'data' => [
                'download_url' => '/api/v1/reports/download/excel/' . uniqid(),
                'expires_at' => now()->addHours(1)->format('d/m/Y H:i:s')
            ]
        ]);
    }

    public function exportPDF(Request $request)
    {
        // Implementation for PDF export
        // You would typically use dompdf or similar package here

        return response()->json([
            'success' => true,
            'message' => 'Export PDF akan segera tersedia',
            'data' => [
                'download_url' => '/api/v1/reports/download/pdf/' . uniqid(),
                'expires_at' => now()->addHours(1)->format('d/m/Y H:i:s')
            ]
        ]);
    }
}