<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alsintan extends Model
{
    use HasFactory;

    protected $table = 'alsintan';

    protected $fillable = [
        'nama_alsintan',
        'kategori',
        'spesifikasi',
        'harga_satuan',
        'satuan',
        'deskripsi'
    ];

    protected $casts = [
        'harga_satuan' => 'decimal:2'
    ];

    // Relationships
    public function pengajuanAlsintan()
    {
        return $this->hasMany(Pengajuan::class);
    }

    public function riwayatPenerimaan()
    {
        return $this->hasMany(RiwayatPenerimaan::class);
    }

    public function distribusiAlsintan()
    {
        return $this->hasMany(DistribusiAlsintan::class);
    }

    // Accessors
    public function getHargaFormattedAttribute()
    {
        return 'Rp ' . number_format($this->harga_satuan, 0, ',', '.');
    }

    public function getTotalDimintaAttribute()
    {
        return $this->pengajuanAlsintan()->sum('jumlah_diminta');
    }

    public function getTotalTerdistribusiAttribute()
    {
        return $this->distribusiAlsintan()->sum('jumlah_diterima');
    }
}