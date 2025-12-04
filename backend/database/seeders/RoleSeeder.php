<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Module;
use App\Models\NavItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all modules
        $modules = Module::all()->keyBy('code');

        // ===== ADMIN MODULE =====
        if ($modules->has('admin')) {
            $adminModule = $modules['admin'];
            
            // Create module-level role
            $adminModuleRole = Role::create([
                'code' => 'NAV:admin',
                'label' => [
                    'en' => 'Admin Access',
                    'ar' => 'الوصول إلى الإدارة',
                    'fr' => 'Accès administrateur',
                    'es' => 'Acceso de administrador',
                ]
            ]);
            
            // Associate module with its role
            $adminModule->roles()->syncWithoutDetaching([$adminModuleRole->id]);

            // Get admin nav items and create individual roles
            $adminNavItems = $adminModule->navItems;
            foreach ($adminNavItems as $navItem) {
                $code = $this->generateCode($navItem->label['en'] ?? 'item', 'admin', $navItem->id);
                
                $navItemRole = Role::create([
                    'code' => 'NAV:' . $code,
                    'label' => $navItem->label,
                ]);
                
                $navItem->roles()->syncWithoutDetaching([$navItemRole->id]);
            }
        }

        // ===== WEBSITE MODULE =====
        if ($modules->has('website')) {
            $websiteModule = $modules['website'];
            
            // Create module-level role
            $websiteModuleRole = Role::create([
                'code' => 'NAV:website',
                'label' => [
                    'en' => 'Website Manager',
                    'ar' => 'مدير الموقع',
                    'fr' => 'Gestionnaire de site',
                    'es' => 'Gerente del sitio',
                ]
            ]);
            
            // Associate module with its role
            $websiteModule->roles()->syncWithoutDetaching([$websiteModuleRole->id]);

            // Get website nav items and create individual roles
            $websiteNavItems = $websiteModule->navItems;
            foreach ($websiteNavItems as $navItem) {
                $code = $this->generateCode($navItem->label['en'] ?? 'item', 'website', $navItem->id);
                
                $navItemRole = Role::create([
                    'code' => 'NAV:' . $code,
                    'label' => $navItem->label,
                ]);
                
                $navItem->roles()->syncWithoutDetaching([$navItemRole->id]);
            }
        }

        // ===== CLAIMS MODULE =====
        if ($modules->has('claims')) {
            $claimsModule = $modules['claims'];
            
            // Create module-level role
            $claimsModuleRole = Role::create([
                'code' => 'NAV:claims',
                'label' => [
                    'en' => 'Claims Manager',
                    'ar' => 'مدير المطالبات',
                    'fr' => 'Gestionnaire des réclamations',
                    'es' => 'Administrador de reclamaciones',
                ]
            ]);
            
            // Associate module with its role
            $claimsModule->roles()->syncWithoutDetaching([$claimsModuleRole->id]);

            // Get claims nav items and create individual roles
            $claimsNavItems = $claimsModule->navItems;
            foreach ($claimsNavItems as $navItem) {
                $code = $this->generateCode($navItem->label['en'] ?? 'item', 'claims', $navItem->id);
                
                $navItemRole = Role::create([
                    'code' => 'NAV:' . $code,
                    'label' => $navItem->label,
                ]);
                
                $navItem->roles()->syncWithoutDetaching([$navItemRole->id]);
            }
        }

        // ===== DOCUMENTS MODULE =====
        if ($modules->has('documents')) {
            $documentsModule = $modules['documents'];
            
            // Create module-level role
            $documentsModuleRole = Role::create([
                'code' => 'NAV:documents',
                'label' => [
                    'en' => 'Documents Admin',
                    'ar' => 'مدير المستندات',
                    'fr' => 'Admin des documents',
                    'es' => 'Admin de documentos',
                ]
            ]);
            
            // Associate module with its role
            $documentsModule->roles()->syncWithoutDetaching([$documentsModuleRole->id]);

            // Get documents nav items and create individual roles
            $documentsNavItems = $documentsModule->navItems;
            foreach ($documentsNavItems as $navItem) {
                $code = $this->generateCode($navItem->label['en'] ?? 'item', 'documents', $navItem->id);
                
                $navItemRole = Role::create([
                    'code' => 'NAV:' . $code,
                    'label' => $navItem->label,
                ]);
                
                $navItem->roles()->syncWithoutDetaching([$navItemRole->id]);
            }
        }
    }

    /**
     * Generate a code from a nav item label
     */
    private function generateCode(string $label, string $module, int $itemId): string
    {
        // Convert to lowercase and replace spaces with hyphens
        $code = strtolower(str_replace(' ', '-', $label));
        // Remove special characters
        $code = preg_replace('/[^a-z0-9\-]/', '', $code);
        // Add module prefix and item ID for uniqueness
        return $module . '-' . $code . '-' . $itemId;
    }
}
