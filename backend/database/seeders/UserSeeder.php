<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or update a deterministic test user for local/dev/tests
        $email = 'test@example.com';

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'), // password: "password"
            ]
        );
    }
}
