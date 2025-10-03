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
        Schema::create('smart_evaluation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengajuan_id')->constrained('pengajuan_alsintan')->onDelete('cascade');
            $table->foreignId('criteria_id')->constrained('smart_criteria')->onDelete('cascade');
            $table->decimal('nilai_raw', 8, 4);
            $table->decimal('nilai_normalized', 10, 6);
            $table->decimal('nilai_weighted', 10, 6);
            $table->text('catatan_evaluasi')->nullable();
            $table->timestamps();

            $table->unique(['pengajuan_id', 'criteria_id']);
            $table->index(['criteria_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('smart_evaluation');
    }
};
