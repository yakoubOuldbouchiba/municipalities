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
        Schema::create('company_claims', function (Blueprint $table) {
            $table->id();
            $table->string('company');
            $table->string('register_number')->index();
            $table->string('email');
            $table->string('phone');
            $table->text('address');
            $table->longText('content');
            $table->json('files')->nullable(); // Array of file paths (max 3)
            $table->enum('status', ['pending', 'answered', 'archived'])->default('pending')->index();
            $table->text('answer')->nullable();
            $table->timestamp('answered_at')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->softDeletes();
            
            // Index for date-based queries (cleanup, old claims)
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_claims');
    }
};
