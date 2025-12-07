<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;
use App\Models\NavItem;
use App\Models\Role;

class SuperAdminModuleSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin Tools Module
        $adminToolsModule = Module::create([
            'code' => 'admin-tools',
            'label' => json_encode([
                'en' => 'Admin Tools',
                'ar' => 'أدوات الإدارة',
                'fr' => 'Outils Admin',
                'es' => 'Herramientas Admin'
            ]),
            'color' => '#EF4444',
            'icon' => 'pi pi-cog',
        ]);

        // Get or create Admin Tools role
        $adminToolsRole = Role::where('code', 'MODULE:admin-tools')->first();
        
        // Attach Admin Tools role to the module itself
        if ($adminToolsRole) {
            $adminToolsModule->roles()->attach($adminToolsRole->id);
        }

        // Add Dashboard navigation item
        $dashboardItem = $adminToolsModule->navItems()->create([
            'label' => json_encode([
                'en' => 'Dashboard',
                'ar' => 'لوحة التحكم',
                'fr' => 'Tableau de bord',
                'es' => 'Panel de control'
            ]),
            'icon' => 'pi pi-chart-bar',
            'path' => '/admin/tools',
        ]);

        // Attach role to navigation item
        if ($adminToolsRole) {
            $dashboardItem->roles()->attach($adminToolsRole->id);
        }
    }
}
