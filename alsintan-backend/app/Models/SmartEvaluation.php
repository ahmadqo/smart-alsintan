<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SmartEvaluation extends Model
{
    use HasFactory;

    protected $table = 'smart_evaluation';

    protected $fillable = [
        'pengajuan_id',
        'criteria_id',
        'nilai_raw',
        'nilai_normalized',
        'nilai_weighted',
        'catatan_evaluasi'
    ];

    protected $casts = [
        'nilai_raw' => 'decimal:4',
        'nilai_normalized' => 'decimal:6',
        'nilai_weighted' => 'decimal:6'
    ];

    // Relationships
    public function pengajuan()
    {
        return $this->belongsTo(Pengajuan::class);
    }

    public function criteria()
    {
        return $this->belongsTo(SmartCriteria::class, 'criteria_id');
    }
}