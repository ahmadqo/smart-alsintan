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
        Schema::create('alsintan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_alsintan');
            $table->string('kategori');
            $table->text('spesifikasi')->nullable();
            $table->decimal('harga_satuan', 15, 2)->nullable();
            $table->string('satuan', 50)->default('unit');
            $table->text('deskripsi')->nullable();
            $table->timestamps();

            $table->index(['kategori']);
            $table->index(['nama_alsintan']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alsintan');
    }
};
