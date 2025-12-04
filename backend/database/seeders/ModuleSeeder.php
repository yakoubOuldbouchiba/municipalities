<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;
use App\Models\Role;
use App\Models\NavItem;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin Module
        $adminModule = Module::create([
            'code' => 'admin',
            'label' => json_encode([
                'en' => 'Admin',
                'ar' => 'إدارة',
                'fr' => 'Admin',
                'es' => 'Admin'
            ]),
            'color' => '#8B5CF6',
            'icon' => 'pi pi-lock',
        ]);

        // Admin nav items
        $adminNavItems = [
            [
                'label' => json_encode(['en' => 'Users', 'ar' => 'المستخدمون', 'fr' => 'Utilisateurs', 'es' => 'Usuarios']),
                'icon' => 'pi pi-users',
                'path' => '/admin/users',
            ],
            [
                'label' => json_encode(['en' => 'Groups', 'ar' => 'المجموعات', 'fr' => 'Groupes', 'es' => 'Grupos']),
                'icon' => 'pi pi-sitemap',
                'path' => '/admin/groups',
            ],
            [
                'label' => json_encode(['en' => 'Roles', 'ar' => 'الأدوار', 'fr' => 'Rôles', 'es' => 'Roles']),
                'icon' => 'pi pi-shield',
                'path' => '/admin/roles',
            ],
            [
                'label' => json_encode(['en' => 'Applications', 'ar' => 'التطبيقات', 'fr' => 'Applications', 'es' => 'Aplicaciones']),
                'icon' => 'pi pi-window-maximize',
                'path' => '/admin/applications',
            ],
            [
                'label' => json_encode(['en' => 'Structures', 'ar' => 'الهياكل', 'fr' => 'Structures', 'es' => 'Estructuras']),
                'icon' => 'pi pi-sitemap',
                'path' => '/admin/structures',
            ],
        ];

        foreach ($adminNavItems as $item) {
            $adminModule->navItems()->create($item);
        }

        // Create Website Module
        $websiteModule = Module::create([
            'code' => 'website',
            'label' => json_encode([
                'en' => 'Website',
                'ar' => 'الموقع الإلكتروني',
                'fr' => 'Site Web',
                'es' => 'Sitio Web'
            ]),
            'color' => '#3B82F6',
            'icon' => 'pi pi-globe',
        ]);

        // Website nav items
        $websiteNavItems = [
            [
                'label' => json_encode(['en' => 'Sliders', 'ar' => 'الشرائح', 'fr' => 'Curseurs', 'es' => 'Deslizadores']),
                'icon' => 'pi pi-images',
                'path' => '/sliders',
            ],
            [
                'label' => json_encode(['en' => 'Advertisements', 'ar' => 'إعلانات', 'fr' => 'Annonces', 'es' => 'Anuncios']),
                'icon' => 'pi pi-bullhorn',
                'path' => '/ads',
            ],
            [
                'label' => json_encode(['en' => 'News', 'ar' => 'أخبار', 'fr' => 'Actualités', 'es' => 'Noticias']),
                'icon' => 'pi pi-newspaper',
                'path' => '/news',
            ],
            [
                'label' => json_encode(['en' => 'Events', 'ar' => 'الفعاليات', 'fr' => 'Événements', 'es' => 'Eventos']),
                'icon' => 'pi pi-calendar',
                'path' => '/events',
            ],
            [
                'label' => json_encode(['en' => 'Papers', 'ar' => 'الوثائق', 'fr' => 'Documents', 'es' => 'Documentos']),
                'icon' => 'pi pi-file',
                'path' => '/papers',
            ],
            [
                'label' => json_encode(['en' => 'Quick Links', 'ar' => 'روابط سريعة', 'fr' => 'Liens rapides', 'es' => 'Enlaces rápidos']),
                'icon' => 'pi pi-link',
                'path' => '/quick-links',
            ],
            [
                'label' => json_encode(['en' => 'Important Numbers', 'ar' => 'أرقام مهمة', 'fr' => 'Numéros importants', 'es' => 'Números importantes']),
                'icon' => 'pi pi-phone',
                'path' => '/important-numbers',
            ],
            [
                'label' => json_encode(['en' => 'Potentials', 'ar' => 'الإمكانيات', 'fr' => 'Potentiel', 'es' => 'Potencial']),
                'icon' => 'pi pi-lightbulb',
                'path' => '/potentials',
            ],
            [
                'label' => json_encode(['en' => 'Persons', 'ar' => 'الأشخاص', 'fr' => 'Personnes', 'es' => 'Personas']),
                'icon' => 'pi pi-user',
                'path' => '/persons',
            ],
        ];

        foreach ($websiteNavItems as $item) {
            $websiteModule->navItems()->create($item);
        }

        // Create Claims Module
        $claimsModule = Module::create([
            'code' => 'claims',
            'label' => json_encode([
                'en' => 'Claims',
                'ar' => 'المطالبات',
                'fr' => 'Réclamations',
                'es' => 'Reclamaciones'
            ]),
            'color' => '#EF4444',
            'icon' => 'pi pi-file-export',
        ]);

        // Claims nav items
        $claimsNavItems = [
            [
                'label' => json_encode(['en' => 'Citizen Claim', 'ar' => 'مطالبة المواطن', 'fr' => 'Réclamation citoyenne', 'es' => 'Reclamación ciudadana']),
                'icon' => 'pi pi-id-card',
                'path' => '/claims/citizen',
            ],
            [
                'label' => json_encode(['en' => 'Company Claim', 'ar' => 'مطالبة الشركة', 'fr' => 'Réclamation de l\'entreprise', 'es' => 'Reclamación empresarial']),
                'icon' => 'pi pi-building',
                'path' => '/claims/company',
            ],
            [
                'label' => json_encode(['en' => 'Organization Claim', 'ar' => 'مطالبة المؤسسة', 'fr' => 'Réclamation organisationnelle', 'es' => 'Reclamación organizacional']),
                'icon' => 'pi pi-sitemap',
                'path' => '/claims/organization',
            ],
        ];

        foreach ($claimsNavItems as $item) {
            $claimsModule->navItems()->create($item);
        }

        // Create Documents Module
        $documentsModule = Module::create([
            'code' => 'documents',
            'label' => json_encode([
                'en' => 'Documents',
                'ar' => 'المستندات',
                'fr' => 'Documents',
                'es' => 'Documentos'
            ]),
            'color' => '#10B981',
            'icon' => 'pi pi-file-pdf',
        ]);

        // Documents nav items
        $documentsNavItems = [
            [
                'label' => json_encode(['en' => 'Official Documents', 'ar' => 'المستندات الرسمية', 'fr' => 'Documents officiels', 'es' => 'Documentos oficiales']),
                'icon' => 'pi pi-check-circle',
                'path' => '/documents/official',
            ],
            [
                'label' => json_encode(['en' => 'Forms', 'ar' => 'النماذج', 'fr' => 'Formulaires', 'es' => 'Formularios']),
                'icon' => 'pi pi-list',
                'path' => '/documents/forms',
            ],
            [
                'label' => json_encode(['en' => 'Reports', 'ar' => 'التقارير', 'fr' => 'Rapports', 'es' => 'Informes']),
                'icon' => 'pi pi-chart-bar',
                'path' => '/documents/reports',
            ],
            [
                'label' => json_encode(['en' => 'Archives', 'ar' => 'الأرشيفات', 'fr' => 'Archives', 'es' => 'Archivos']),
                'icon' => 'pi pi-inbox',
                'path' => '/documents/archives',
            ],
        ];

        foreach ($documentsNavItems as $item) {
            $documentsModule->navItems()->create($item);
        }

        // Attach corresponding roles to each module
        $this->attachRolesToModules([
            'admin' => ['MODULE:admin'],
            'website' => ['MODULE:website'],
            'claims' => ['MODULE:claims'],
            'documents' => ['MODULE:documents'],
        ]);

        // Attach roles to nav items
        $this->attachRolesToNavItems([
            'Users' => ['NAV:UserManagement'],
            'Groups' => ['NAV:GroupManagement'],
            'Roles' => ['NAV:RoleManagement'],
            'Applications' => ['NAV:ApplicationManagement'],
            'Structures' => ['NAV:StructureManagement'],
            'Sliders' => ['NAV:Sliders'],
            'Advertisements' => ['NAV:Advertisements'],
            'News' => ['NAV:News'],
            'Events' => ['NAV:Events'],
            'Papers' => ['NAV:Papers'],
            'Quick Links' => ['NAV:Quick Links'],
            'Important Numbers' => ['NAV:Important Numbers'],
            'Potentials' => ['NAV:Potentials'],
            'Persons' => ['NAV:Presons'],
            'Official Documents' => ['NAV:OfficialDocumentManagement'],
            'Forms' => ['NAV:FormsManagement'],
            'Reports' => ['NAV:ReportsManagement'],
            'Archives' => ['NAV:ArchivesManagement'],
            'Citizen Claim' => ['NAV:CitizenClaimManagement'],
            'Company Claim' => ['NAV:CompanyClaimManagement'],
            'Organization Claim' => ['NAV:OrganizationClaimManagement'],
        ]);
    }

    /**
     * Attach roles to modules based on role codes.
     */
    private function attachRolesToModules(array $moduleRoleMappings): void
    {
        foreach ($moduleRoleMappings as $moduleCode => $roleCodes) {
            $module = Module::where('code', $moduleCode)->first();
            
            if (!$module) {
                continue;
            }

            // Find roles by their codes
            $roles = Role::whereIn('code', $roleCodes)->get();
            
            if ($roles->isNotEmpty()) {
                // Sync roles to the module (replaces existing)
                $module->roles()->sync($roles->pluck('id')->toArray());
            }
        }
    }

    /**
     * Attach roles to nav items based on nav item labels.
     */
    private function attachRolesToNavItems(array $navItemRoleMappings): void
    {
        foreach ($navItemRoleMappings as $navItemLabel => $roleCodes) {
            // Find nav items by their decoded label
            $navItems = NavItem::whereRaw("JSON_UNQUOTE(JSON_EXTRACT(label, '$.en')) = ?", [$navItemLabel])->get();
            
            foreach ($navItems as $navItem) {
                // Find roles by their codes
                $roles = Role::whereIn('code', $roleCodes)->get();
                
                if ($roles->isNotEmpty()) {
                    // Sync roles to the nav item (replaces existing)
                    $navItem->roles()->sync($roles->pluck('id')->toArray());
                }
            }
        }
    }
}
