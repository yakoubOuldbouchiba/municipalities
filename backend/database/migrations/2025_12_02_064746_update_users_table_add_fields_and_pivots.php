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
        //update users table to add new fields and pivot tables
        Schema::table('users', function (Blueprint $table) {
            $table->json('firstname');
            $table->json('lastname');
            $table->string('name')->unique()->change();
            $table->date('birthdate');
            $table->string('birthplace');
            $table->string('nin')->unique();
            $table->string('phone')->nullable();
            $table->string('iphone')->nullable();
            $table->enum('gender', ['male', 'female']);
            $table->string('photo')->nullable();
            $table->json('address');
            $table->boolean('active')->default(true);
            // Add indexes for performance
            $table->index('email');
            $table->index('name');
            $table->index('nin');
            $table->index('active');
        });

        // Create pivot tables for roles, groups, and structures
        Schema::create('user_role', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('role_id');
            $table->primary(['user_id', 'role_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });
        Schema::create('user_group', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('group_id');
            $table->primary(['user_id', 'group_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
        });
        Schema::create('user_structure', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('structure_id');
            $table->primary(['user_id', 'structure_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('structure_id')->references('id')->on('structures')->onDelete('cascade');
        });
    
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['email']);
            $table->dropIndex(['name']);
            $table->dropIndex(['nin']);
            $table->dropIndex(['active']);
        });
        Schema::dropIfExists('user_role');
        Schema::dropIfExists('user_group');
        Schema::dropIfExists('user_structure'); 
    }
};
