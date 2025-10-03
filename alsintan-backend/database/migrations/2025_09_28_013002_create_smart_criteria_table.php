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
        Schema::create('smart_criteria', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kriteria');
            $table->text('deskripsi')->nullable();
            $table->decimal('bobot_persen', 5, 2); // Max 100.00
            $table->enum('tipe_data', ['numeric', 'categorical', 'boolean'])->default('numeric');
            $table->decimal('nilai_min', 8, 2)->default(0);
            $table->decimal('nilai_max', 8, 2)->default(100);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('smart_criteria');
    }
};
