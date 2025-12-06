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

        $roles = [
            [
                'code' => 'MODULE:admin',
                'label' => [
                    'en' => 'Admin Access',
                    'ar' => 'الوصول إلى الإدارة',
                    'fr' => 'Accès administrateur',
                    'es' => 'Acceso de administrador',
                ]
            ],
            [
                'code' => 'MODULE:website',
                'label' => [
                    'en' => 'Website Manager',
                    'ar' => 'مدير الموقع',
                    'fr' => 'Gestionnaire de site',
                    'es' => 'Gerente del sitio',
                ]
            ],
            [
                'code' => 'MODULE:claims',
                'label' => [
                    'en' => 'Claims Manager',
                    'ar' => 'مدير المطالبات',
                    'fr' => 'Gestionnaire des réclamations',
                    'es' => 'Administrador de reclamaciones',
                ]
            ],
            [
                'code' => 'MODULE:documents',
                'label' => [
                    'en' => 'Documents Admin',
                    'ar' => 'مدير المستندات',
                    'fr' => 'Admin des documents',
                    'es' => 'Admin de documentos',
                ]
            ],
            [
                'code' => 'MODULE:superadmin',
                'label' => [
                    'en' => 'Super Admin Access',
                    'ar' => 'وصول المسؤول الأول',
                    'fr' => 'Accès super administrateur',
                    'es' => 'Acceso de superadministrador',
                ]
            ],
            [
                'code' => 'NAV:Events',
                'label' => [
                    'en' => 'Events Manager',
                    'ar' => 'مدير الأحداث',
                    'fr' => "Gestionnaire d'événements",
                    'es' => 'Administrador de eventos',

                ]
            ],
            [
                'code' => 'NAV:News',
                'label' => [
                    'en' => 'News Manager',
                    'ar' => 'مدير الأخبار',
                    'fr' => 'Gestionnaire des actualités',
                    'es' => 'Administrador de noticias',
                ]
            ],
            [
                'code' => 'NAV:Papers',
                'label' => [
                    'en' => 'Papers Manager',
                    'ar' => 'مدير الأوراق',
                    'fr' => 'Gestionnaire des documents',
                    'es' => 'Administrador de documentos',
                ]
            ],
            [
                'code' => 'NAV:Quick Links',
                'label' => [
                    'en' => 'Quick Links Manager',

                    'ar' => 'مدير الروابط السريعة',
                    'fr' => 'Gestionnaire des liens rapides',
                    'es' => 'Administrador de enlaces rápidos',
                ]
            ],
            [
                'code' => 'NAV:Sliders',
                'label' => [
                    'en' => 'Sliders Manager',
                    'ar' => 'مدير الشرائح',
                    'fr' => 'Gestionnaire des curseurs',
                    'es' => 'Administrador de deslizadores',
                ]
            ],
            [
                'code' => 'NAV:Presons',
                'label' => [
                    'en' => 'Persons Manager',
                    'ar' => 'مدير الأشخاص',
                    'fr' => 'Gestionnaire des personnes',
                    'es' => 'Administrador de personas',
                ]
            ],
            [
                'code' => 'NAV:Important Numbers',
                'label' => [
                    'en' => 'Important Numbers Manager',
                    'ar' => 'مدير الأرقام المهمة',
                    'fr' => 'Gestionnaire des numéros importants',
                    'es' => 'Administrador de números importantes',
                ]
            ],
            [
                'code' => 'NAV:Potentials',
                'label' => [
                    'en' => 'Potentials Manager',
                    'ar' => 'مدير الإمكانيات',
                    'fr' => 'Gestionnaire du potentiel',
                    'es' => 'Administrador de potenciales',
                ]
            ],
            [
                'code' => 'NAV:Advertisements',
                'label' => [
                    'en' => 'Advertisements Manager',
                    'ar' => 'مدير الإعلانات',
                    'fr' => 'Gestionnaire des publicités',
                    'es' => 'Administrador de anuncios',
                ]
            ],
            [
                'code' => 'NAV:UserManagement',
                'label' => [
                    'en' => 'Users Management',
                    'ar' => ' إدارة المستخدمين',
                    'fr' => 'Gestion des utilisateurs',
                    'es' => 'Administración de usuarios',
                ]
            ],
            [
                'code' => 'NAV:StructureManagement',
                'label' => [
                    'en' => 'Structures Management',
                    'ar' => 'إدارة الهياكل',
                    'fr' => 'Gestion des structures',
                    'es' => 'Gestión de estructuras'
                ]
            ],
            [
                'code' => 'NAV:GroupManagement',
                'label' => [
                    'en' => 'Groups Management of roles',
                    'ar' => 'إدارة المجموعات',
                    'fr' => 'Gestion des groupes',
                    'es' => 'Gestión de grupos'
                ]
            ],
            [
                'code' => 'NAV:RoleManagement',
                'label' => [
                    'en' => 'Roles Management',
                    'ar' => 'إدارة الأدوار',
                    'fr' => 'Gestion des rôles',
                    'es' => 'Gestión de roles'
                ]
            ],
            [
                'code' => 'NAV:ApplicationManagement',
                'label' => [
                    'en' => 'Application Management',
                    'ar' => 'إدارة التطبيقات',
                    'fr' => 'Gestion des applications',
                    'es' => 'Gestión de aplicaciones'
                ]
            ],
            [
                'code' => 'NAV:OfficialDocumentManagement',
                'label' => [
                    'en' => 'Official Document Management',
                    'ar' => 'إدارة المستندات الرسمية',
                    'fr' => 'Gestion des documents officiels',
                    'es' => 'Gestión de documentos oficiales'
                ]
            ],
            [
                'code' => 'NAV:FormsManagement',
                'label' => [
                    'en' => 'Forms Management',
                    'ar' => 'إدارة النماذج',
                    'fr' => 'Gestion des formulaires',
                    'es' => 'Gestión de formularios'
                ]
            ],
            [
                'code' => 'NAV:ReportsManagement',
                'label' => [
                    'en' => 'Reports Management',
                    'ar' => 'إدارة التقارير',
                    'fr' => 'Gestion des rapports',
                    'es' => 'Gestión de informes'
                ]
            ],
            [
                'code' => 'NAV:ArchivesManagement',
                'label' => [
                    'en' => 'Archives Management',
                    'ar' => 'إدارة الأرشيفات',
                    'fr' => 'Gestion des archives',
                    'es' => 'Gestión de archivos'
                ]
            ],
            [
                'code' => 'NAV:CitizenClaimManagement',
                'label' => [
                    'en' => 'Citizen Claims Management',
                    'ar' => 'إدارة مطالبات المواطنين',
                    'fr' => 'Gestion des réclamations des citoyens',
                    'es' => 'Gestión de reclamaciones de ciudadanos'
                ]
            ],
            [
                'code' => 'NAV:CompanyClaimManagement',
                'label' => [
                    'en' => 'Company Claims Management',
                    'ar' => 'إدارة مطالبات الشركات',
                    'fr' => 'Gestion des réclamations des entreprises',
                    'es' => 'Gestión de reclamaciones de empresas'
                ]
            ],
            [
                'code' => 'NAV:OrganizationClaimManagement',
                'label' => [
                    'en' => 'Organization Claims Management',
                    'ar' => 'إدارة مطالبات المؤسسات',
                    'fr' => 'Gestion des réclamations des organisations',
                    'es' => 'Gestión de reclamaciones de organizaciones'
                ]
            ],
        ];
        foreach ($roles as $roleData) {
            Role::updateOrCreate(
                ['code' => $roleData['code']],
                ['label' => json_encode($roleData['label'])]
            );
        }
    }
}
