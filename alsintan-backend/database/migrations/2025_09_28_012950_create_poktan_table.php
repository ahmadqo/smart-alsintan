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
        Schema::create('poktan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kecamatan_id')->constrained('kecamatan')->onDelete('cascade');
            $table->string('nama_poktan');
            $table->string('ketua_poktan');
            $table->text('alamat');
            $table->string('desa_kelurahan');
            $table->string('no_telepon', 20)->nullable();
            $table->integer('jumlah_anggota')->default(0);
            $table->decimal('luas_garapan', 8, 2)->default(0);
            $table->string('jenis_komoditas');
            $table->year('tahun_pembentukan');
            $table->boolean('status_aktif')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['nama_poktan', 'kecamatan_id']);
            $table->index(['status_aktif']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('poktan');
    }
};
