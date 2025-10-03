<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DistribusiAlsintan extends Model
{
    use HasFactory;

    protected $table = 'distribusi_alsintan';

    protected $fillable = [
        'pengajuan_id',
        'jumlah_diterima',
        'tanggal_distribusi',
        'lokasi_penyerahan',
        'kondisi_alsintan',
        'status_distribusi',
        'catatan',
        'distributed_by'
    ];

    protected $casts = [
        'tanggal_distribusi' => 'date',
        'jumlah_diterima' => 'integer'
    ];

    // Relationships
    public function pengajuan()
    {
        return $this->belongsTo(Pengajuan::class);
    }

    public function distributor()
    {
        return $this->belongsTo(User::class, 'distributed_by');
    }

    // Accessors
    public function getStatusBadgeAttribute()
    {
        $badges = [
            'dalam_perjalanan' => ['class' => 'info', 'text' => 'Dalam Perjalanan'],
            'diserahkan' => ['class' => 'success', 'text' => 'Diserahkan'],
            'diterima' => ['class' => 'primary', 'text' => 'Diterima Poktan']
        ];

        return $badges[$this->status_distribusi] ?? ['class' => 'secondary', 'text' => 'Unknown'];
    }
}