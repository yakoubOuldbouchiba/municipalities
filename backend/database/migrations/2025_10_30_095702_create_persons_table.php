<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('persons', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // e.g. 'mayor', 'secretary_general'
            $table->json('names'); // {"en": "...", "ar": "..."}
            $table->json('messages')->nullable(); // for current person message
            $table->json('achievements')->nullable(); // for history entries
            $table->string('image_url')->nullable();
            $table->string('period')->nullable(); // e.g. "2010 - 2020"
            $table->boolean('is_current')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('persons');
    }
};
