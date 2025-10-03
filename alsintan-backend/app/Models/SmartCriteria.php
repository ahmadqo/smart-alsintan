<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmartCriteria extends Model
{
    use HasFactory;

    protected $table = 'smart_criteria';

    protected $fillable = [
        'nama_kriteria',
        'deskripsi',
        'bobot_persen',
        'tipe_data',
        'nilai_min',
        'nilai_max',
        'is_active'
    ];

    protected $casts = [
        'bobot_persen' => 'decimal:2',
        'nilai_min' => 'decimal:2',
        'nilai_max' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    // Relationships
    public function smartEvaluations()
    {
        return $this->hasMany(SmartEvaluation::class, 'criteria_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('bobot_persen', 'desc');
    }
}
