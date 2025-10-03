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
        Schema::table('users', function (Blueprint $table) {
            // Modify existing columns
            $table->string('username')->unique()->after('id');
            $table->string('nama')->after('username');
            $table->string('email')->nullable()->change();

            // Add new columns
            $table->enum('role', ['admin', 'staff'])->default('staff')->after('email');
            $table->timestamp('last_login_at')->nullable()->after('email_verified_at');

            // Drop email verification if not needed
            $table->dropColumn('email_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'nama', 'role', 'last_login_at']);
            $table->string('email')->nullable(false)->change();
            $table->timestamp('email_verified_at')->nullable();
        });
    }
};
