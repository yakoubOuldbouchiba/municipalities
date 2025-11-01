<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('papers', function (Blueprint $table) {
            $table->id();
            $table->json('titles'); // {"en": "...", "ar": "...", "fr": "..."}
            $table->json('descriptions'); // {"en": "...", "ar": "...", "fr": "..."}
            $table->string('slug')->unique(); // e.g. "identity", "driving"
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('papers');
    }
};
