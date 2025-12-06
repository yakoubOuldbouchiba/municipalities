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
        // Create Super Admin Module
        $superAdminModule = Module::create([
            'code' => 'superadmin',
            'label' => json_encode([
                'en' => 'Super Admin',
                'ar' => 'مسؤول عام',
                'fr' => 'Super Administrateur',
                'es' => 'Super Administrador'
            ]),
            'color' => '#EF4444',
            'icon' => 'pi pi-cog',
        ]);

        // Get or create Super Admin role
        $superAdminRole = Role::where('code', 'MODULE:superadmin')->first();
        
        // Attach Super Admin role to the module itself
        if ($superAdminRole) {
            $superAdminModule->roles()->attach($superAdminRole->id);
        }

        // Super Admin nav items
        $superAdminNavItems = [
            [
                'label' => json_encode([
                    'en' => 'Dashboard',
                    'ar' => 'لوحة التحكم',
                    'fr' => 'Tableau de bord',
                    'es' => 'Panel de control'
                ]),
                'icon' => 'pi pi-chart-bar',
                'path' => '/admin/superadmin',
            ],
            [
                'label' => json_encode([
                    'en' => 'Database Viewer',
                    'ar' => 'عارض قاعدة البيانات',
                    'fr' => 'Visualiseur de base de données',
                    'es' => 'Visor de base de datos'
                ]),
                'icon' => 'pi pi-database',
                'path' => '/admin/superadmin?tab=database',
            ],
            [
                'label' => json_encode([
                    'en' => 'Redis Monitor',
                    'ar' => 'مراقب ريديس',
                    'fr' => 'Moniteur Redis',
                    'es' => 'Monitor Redis'
                ]),
                'icon' => 'pi pi-circle',
                'path' => '/admin/superadmin?tab=redis',
            ],
            [
                'label' => json_encode([
                    'en' => 'System Monitor',
                    'ar' => 'مراقب النظام',
                    'fr' => 'Moniteur système',
                    'es' => 'Monitor del sistema'
                ]),
                'icon' => 'pi pi-microchip',
                'path' => '/admin/superadmin?tab=system',
            ],
            [
                'label' => json_encode([
                    'en' => 'Grafana',
                    'ar' => 'جرافانا',
                    'fr' => 'Grafana',
                    'es' => 'Grafana'
                ]),
                'icon' => 'pi pi-chart-line',
                'path' => '/admin/superadmin?tab=grafana',
            ],
        ];

        foreach ($superAdminNavItems as $item) {
            $navItem = $superAdminModule->navItems()->create($item);
            
            // Attach Super Admin role to each navigation item
            if ($superAdminRole) {
                $navItem->roles()->attach($superAdminRole->id);
            }
        }
    }
}
