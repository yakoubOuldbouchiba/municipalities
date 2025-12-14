<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'last_requested_password_reset_at')) {
                $table->timestamp('last_requested_password_reset_at')->nullable();
            }
            if (!Schema::hasColumn('users', 'last_password_reset_at')) {
                $table->timestamp('last_password_reset_at')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['last_requested_password_reset_at', 'last_password_reset_at']);
        });
    }
};
