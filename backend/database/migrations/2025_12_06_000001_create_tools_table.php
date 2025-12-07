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
        Schema::create('tools', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->json('label'); // {'en': 'Tool Name', 'ar': '...', 'fr': '...', 'es': '...'}
            $table->json('description'); // {'en': 'Description', 'ar': '...', 'fr': '...', 'es': '...'}
            $table->string('icon')->default('pi pi-cog');
            $table->string('url');
            $table->string('color')->default('#3B82F6');
            $table->integer('order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        // Create pivot table for tools and roles
        Schema::create('role_tool', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');
            $table->foreignId('tool_id')->constrained('tools')->onDelete('cascade');
            $table->unique(['role_id', 'tool_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_tool');
        Schema::dropIfExists('tools');
    }
};
