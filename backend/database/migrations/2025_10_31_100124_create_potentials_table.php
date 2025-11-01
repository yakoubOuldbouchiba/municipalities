<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('potentials', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique(); // ex: tourism, agriculture...
            $table->json('title'); // multilingual title
            $table->json('description'); // multilingual description
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('potentials');
    }
};

