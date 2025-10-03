<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Poktan extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'poktan';

    protected $fillable = [
        'kecamatan_id',
        'nama_poktan',
        'ketua_poktan',
        'alamat',
        'desa_kelurahan',
        'no_telepon',
        'jumlah_anggota',
        'luas_garapan',
        'jenis_komoditas',
        'tahun_pembentukan',
        'status_aktif'
    ];

    protected $casts = [
        'luas_garapan' => 'decimal:2',
        'tahun_pembentukan' => 'integer',
        'jumlah_anggota' => 'integer',
        'status_aktif' => 'boolean'
    ];

    // Relationships
    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class);
    }

    public function pengajuanAlsintan()
    {
        return $this->hasMany(Pengajuan::class);
    }

    public function riwayatPenerimaan()
    {
        return $this->hasMany(RiwayatPenerimaan::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status_aktif', true);
    }

    public function scopeByKecamatan($query, $kecamatanId)
    {
        return $query->where('kecamatan_id', $kecamatanId);
    }

    // Accessors
    public function getUmurPoktanAttribute()
    {
        return now()->year - $this->tahun_pembentukan;
    }

    public function getTotalPenerimaanAttribute()
    {
        return $this->riwayatPenerimaan()->count();
    }
}