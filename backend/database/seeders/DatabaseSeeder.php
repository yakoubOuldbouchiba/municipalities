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
        $this->call(RoleSeeder::class);          // Run RoleSeeder FIRST
        $this->call(ModuleSeeder::class);        // Then ModuleSeeder (attaches roles)
        $this->call(SuperAdminModuleSeeder::class);  // Super Admin Module
        $this->call(ToolSeeder::class);          // Admin tools (phpMyAdmin, Grafana, etc.)
        $this->call(GroupSeeder::class);
        $this->call(StructureSeeder::class);
        $this->call(QuickLinkSeeder::class);
        $this->call(UserSeeder::class);
    }
}
