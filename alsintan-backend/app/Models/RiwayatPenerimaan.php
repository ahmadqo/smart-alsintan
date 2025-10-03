<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiwayatPenerimaan extends Model
{
    use HasFactory;

    protected $table = 'riwayat_penerimaan';

    protected $fillable = [
        'poktan_id',
        'alsintan_id',
        'jumlah_diterima',
        'tanggal_penerimaan',
        'tahun_anggaran',
        'sumber_anggaran',
        'nilai_bantuan',
        'catatan'
    ];

    protected $casts = [
        'tanggal_penerimaan' => 'date',
        'nilai_bantuan' => 'decimal:2',
        'jumlah_diterima' => 'integer',
        'tahun_anggaran' => 'integer'
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

    // Scopes
    public function scopeByYear($query, $year)
    {
        return $query->where('tahun_anggaran', $year);
    }

    public function scopeByPoktan($query, $poktanId)
    {
        return $query->where('poktan_id', $poktanId);
    }

    // Accessors
    public function getNilaiBantuanFormattedAttribute()
    {
        return 'Rp ' . number_format($this->nilai_bantuan, 0, ',', '.');
    }
}