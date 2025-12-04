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
        Schema::create('structures', function (Blueprint $table) {
            $table->id();
            $table->json('label')->nullable()->comment('Multilingual labels: {"en": "...", "fr": "...", "ar": "...", "es": "..."}');
            $table->string('code')->unique();
            $table->unsignedBigInteger('id_parent')->nullable();
            $table->foreign('id_parent')->references('id')->on('structures')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('structures');
    }
};
