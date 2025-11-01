<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(EventSeeder::class);
        $this->call(HomeImageSeeder::class); 
        $this->call(PersonSeeder::class);
        $this->call(PaperSeeder::class);
        $this->call(AdSeeder::class);
        $this->call(PotentialSeeder::class);
        $this->call(ImportantNumberSeeder::class);
        $this->call(QuickLinkSeeder::class);    
    }
}
