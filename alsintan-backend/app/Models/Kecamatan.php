<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
    use HasFactory;

    protected $table = 'kecamatan';

    protected $fillable = [
        'nama_kecamatan',
        'kode_kecamatan',
        'alamat',
        'kepala_kecamatan'
    ];

    // Relationships
    public function poktan()
    {
        return $this->hasMany(Poktan::class);
    }

    public function getTotalPoktanAttribute()
    {
        return $this->poktan()->count();
    }

    public function getTotalPoktanAktifAttribute()
    {
        return $this->poktan()->active()->count();
    }
}
