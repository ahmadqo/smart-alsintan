<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengajuan_alsintan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('poktan_id')->constrained('poktan')->onDelete('cascade');
            $table->foreignId('alsintan_id')->constrained('alsintan')->onDelete('cascade');
            $table->integer('jumlah_diminta');
            $table->text('alasan_pengajuan');
            $table->enum('status_pengajuan', ['pending', 'disetujui', 'ditolak', 'terdistribusi'])->default('pending');
            $table->date('tanggal_pengajuan');
            $table->date('tanggal_persetujuan_kelurahan')->nullable();
            $table->date('tanggal_persetujuan_kecamatan')->nullable();
            $table->date('tanggal_persetujuan_dinas')->nullable();
            $table->decimal('smart_score', 8, 4)->nullable();
            $table->integer('ranking_prioritas')->nullable();
            $table->text('catatan_verifikasi')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status_pengajuan']);
            $table->index(['smart_score']);
            $table->index(['ranking_prioritas']);
            $table->index(['tanggal_pengajuan']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengajuan_alsintan');
    }
};
