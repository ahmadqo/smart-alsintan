<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pengajuan extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pengajuan_alsintan';

    protected $fillable = [
        'poktan_id',
        'alsintan_id',
        'jumlah_diminta',
        'alasan_pengajuan',
        'status_pengajuan',
        'tanggal_pengajuan',
        'tanggal_persetujuan_kelurahan',
        'tanggal_persetujuan_kecamatan',
        'tanggal_persetujuan_dinas',
        'smart_score',
        'ranking_prioritas',
        'catatan_verifikasi',
        'created_by'
    ];

    protected $casts = [
        'tanggal_pengajuan' => 'date',
        'tanggal_persetujuan_kelurahan' => 'date',
        'tanggal_persetujuan_kecamatan' => 'date',
        'tanggal_persetujuan_dinas' => 'date',
        'smart_score' => 'decimal:4',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationships
    public function poktan()
    {
        return $this->belongsTo(Poktan::class);
    }

    public function alsintan()
    {
        return $this->belongsTo(Alsintan::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function smartEvaluations()
    {
        return $this->hasMany(SmartEvaluation::class);
    }

    public function distribusi()
    {
        return $this->hasOne(DistribusiAlsintan::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status_pengajuan', 'pending');
    }

    public function scopeDisetujui($query)
    {
        return $query->where('status_pengajuan', 'disetujui');
    }

    public function scopeByYear($query, $year)
    {
        return $query->whereYear('tanggal_pengajuan', $year);
    }

    public function scopeWithSmartScore($query)
    {
        return $query->whereNotNull('smart_score');
    }

    // Accessors
    public function getStatusBadgeAttribute()
    {
        $badges = [
            'pending' => ['class' => 'warning', 'text' => 'Menunggu'],
            'disetujui' => ['class' => 'success', 'text' => 'Disetujui'],
            'ditolak' => ['class' => 'danger', 'text' => 'Ditolak'],
            'terdistribusi' => ['class' => 'info', 'text' => 'Terdistribusi']
        ];

        return $badges[$this->status_pengajuan] ?? ['class' => 'secondary', 'text' => 'Unknown'];
    }

    public function getSmartScoreFormattedAttribute()
    {
        return $this->smart_score ? number_format($this->smart_score, 3) : '-';
    }
}