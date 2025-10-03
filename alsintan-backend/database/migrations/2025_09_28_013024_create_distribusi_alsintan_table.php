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
        Schema::create('distribusi_alsintan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengajuan_id')->constrained('pengajuan_alsintan')->onDelete('cascade');
            $table->integer('jumlah_diterima');
            $table->date('tanggal_distribusi');
            $table->string('lokasi_penyerahan')->nullable();
            $table->text('kondisi_alsintan')->nullable();
            $table->enum('status_distribusi', ['dalam_perjalanan', 'diserahkan', 'diterima'])->default('dalam_perjalanan');
            $table->text('catatan')->nullable();
            $table->foreignId('distributed_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['tanggal_distribusi']);
            $table->index(['status_distribusi']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distribusi_alsintan');
    }
};
