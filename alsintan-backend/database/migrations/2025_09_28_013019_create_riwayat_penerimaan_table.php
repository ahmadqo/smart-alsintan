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
        Schema::create('riwayat_penerimaan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('poktan_id')->constrained('poktan')->onDelete('cascade');
            $table->foreignId('alsintan_id')->constrained('alsintan')->onDelete('cascade');
            $table->integer('jumlah_diterima');
            $table->date('tanggal_penerimaan');
            $table->year('tahun_anggaran');
            $table->string('sumber_anggaran', 100)->default('APBD');
            $table->decimal('nilai_bantuan', 15, 2)->default(0);
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->index(['poktan_id', 'tanggal_penerimaan']);
            $table->index(['tahun_anggaran']);
            $table->index(['alsintan_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('riwayat_penerimaan');
    }
};
