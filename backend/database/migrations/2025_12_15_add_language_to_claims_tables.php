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
        // Add language column to citizen_claims table if it doesn't exist
        Schema::table('citizen_claims', function (Blueprint $table) {
            if (!Schema::hasColumn('citizen_claims', 'language')) {
                $table->string('language')->default('en')->after('nin');
            }
        });

        // Add language column to company_claims table if it doesn't exist
        Schema::table('company_claims', function (Blueprint $table) {
            if (!Schema::hasColumn('company_claims', 'language')) {
                $table->string('language')->default('en')->after('register_number');
            }
        });

        // Add language column to organization_claims table if it doesn't exist
        Schema::table('organization_claims', function (Blueprint $table) {
            if (!Schema::hasColumn('organization_claims', 'language')) {
                $table->string('language')->default('en')->after('company');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('citizen_claims', function (Blueprint $table) {
            $table->dropColumn('language');
        });

        Schema::table('company_claims', function (Blueprint $table) {
            $table->dropColumn('language');
        });

        Schema::table('organization_claims', function (Blueprint $table) {
            $table->dropColumn('language');
        });
    }
};
