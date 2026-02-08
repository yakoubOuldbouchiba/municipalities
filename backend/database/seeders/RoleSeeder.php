<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $roles = [
            // API Operation Roles
            [
                'code' => 'API:read-all',
                'label' => [
                    'en' => 'Read All Resources',
                    'ar' => 'قراءة جميع الموارد',
                    'fr' => 'Lire toutes les ressources',
                    'es' => 'Leer todos los recursos',
                ]
            ],
            [
                'code' => 'API:write-all',
                'label' => [
                    'en' => 'Write All Resources',
                    'ar' => 'كتابة جميع الموارد',
                    'fr' => 'Écrire toutes les ressources',
                    'es' => 'Escribir todos los recursos',
                ]
            ],
            [
                'code' => 'API:delete-all',
                'label' => [
                    'en' => 'Delete All Resources',
                    'ar' => 'حذف جميع الموارد',
                    'fr' => 'Supprimer toutes les ressources',
                    'es' => 'Eliminar todos los recursos',
                ]
            ],
            // Resource-specific READ roles
            [
                'code' => 'API:read-ads',
                'label' => [
                    'en' => 'Read Advertisements',
                    'ar' => 'قراءة الإعلانات',
                    'fr' => 'Lire les publicités',
                    'es' => 'Leer anuncios',
                ]
            ],
            [
                'code' => 'API:read-news',
                'label' => [
                    'en' => 'Read News',
                    'ar' => 'قراءة الأخبار',
                    'fr' => 'Lire les actualités',
                    'es' => 'Leer noticias',
                ]
            ],
            [
                'code' => 'API:read-events',
                'label' => [
                    'en' => 'Read Events',
                    'ar' => 'قراءة الأحداث',
                    'fr' => 'Lire les événements',
                    'es' => 'Leer eventos',
                ]
            ],
            [
                'code' => 'API:read-papers',
                'label' => [
                    'en' => 'Read Papers',
                    'ar' => 'قراءة الأوراق',
                    'fr' => 'Lire les documents',
                    'es' => 'Leer documentos',
                ]
            ],
            [
                'code' => 'API:read-persons',
                'label' => [
                    'en' => 'Read Persons',
                    'ar' => 'قراءة الأشخاص',
                    'fr' => 'Lire les personnes',
                    'es' => 'Leer personas',
                ]
            ],
            [
                'code' => 'API:read-potentials',
                'label' => [
                    'en' => 'Read Potentials',
                    'ar' => 'قراءة الإمكانيات',
                    'fr' => 'Lire le potentiel',
                    'es' => 'Leer potenciales',
                ]
            ],
            [
                'code' => 'API:read-quick-links',
                'label' => [
                    'en' => 'Read Quick Links',
                    'ar' => 'قراءة الروابط السريعة',
                    'fr' => 'Lire les liens rapides',
                    'es' => 'Leer enlaces rápidos',
                ]
            ],
            [
                'code' => 'API:read-important-numbers',
                'label' => [
                    'en' => 'Read Important Numbers',
                    'ar' => 'قراءة الأرقام المهمة',
                    'fr' => 'Lire les numéros importants',
                    'es' => 'Leer números importantes',
                ]
            ],
            [
                'code' => 'API:read-home-images',
                'label' => [
                    'en' => 'Read Home Images',
                    'ar' => 'قراءة صور الصفحة الرئيسية',
                    'fr' => 'Lire les images d\'accueil',
                    'es' => 'Leer imágenes de inicio',
                ]
            ],
            // Resource-specific WRITE roles (Create, Update)
            [
                'code' => 'API:write-ads',
                'label' => [
                    'en' => 'Write Advertisements',
                    'ar' => 'كتابة الإعلانات',
                    'fr' => 'Écrire les publicités',
                    'es' => 'Escribir anuncios',
                ]
            ],
            [
                'code' => 'API:write-news',
                'label' => [
                    'en' => 'Write News',
                    'ar' => 'كتابة الأخبار',
                    'fr' => 'Écrire les actualités',
                    'es' => 'Escribir noticias',
                ]
            ],
            [
                'code' => 'API:write-events',
                'label' => [
                    'en' => 'Write Events',
                    'ar' => 'كتابة الأحداث',
                    'fr' => 'Écrire les événements',
                    'es' => 'Escribir eventos',
                ]
            ],
            [
                'code' => 'API:write-papers',
                'label' => [
                    'en' => 'Write Papers',
                    'ar' => 'كتابة الأوراق',
                    'fr' => 'Écrire les documents',
                    'es' => 'Escribir documentos',
                ]
            ],
            [
                'code' => 'API:write-persons',
                'label' => [
                    'en' => 'Write Persons',
                    'ar' => 'كتابة الأشخاص',
                    'fr' => 'Écrire les personnes',
                    'es' => 'Escribir personas',
                ]
            ],
            [
                'code' => 'API:write-potentials',
                'label' => [
                    'en' => 'Write Potentials',
                    'ar' => 'كتابة الإمكانيات',
                    'fr' => 'Écrire le potentiel',
                    'es' => 'Escribir potenciales',
                ]
            ],
            [
                'code' => 'API:write-quick-links',
                'label' => [
                    'en' => 'Write Quick Links',
                    'ar' => 'كتابة الروابط السريعة',
                    'fr' => 'Écrire les liens rapides',
                    'es' => 'Escribir enlaces rápidos',
                ]
            ],
            [
                'code' => 'API:write-important-numbers',
                'label' => [
                    'en' => 'Write Important Numbers',
                    'ar' => 'كتابة الأرقام المهمة',
                    'fr' => 'Écrire les numéros importants',
                    'es' => 'Escribir números importantes',
                ]
            ],
            [
                'code' => 'API:write-home-images',
                'label' => [
                    'en' => 'Write Home Images',
                    'ar' => 'كتابة صور الصفحة الرئيسية',
                    'fr' => 'Écrire les images d\'accueil',
                    'es' => 'Escribir imágenes de inicio',
                ]
            ],
            // Resource-specific DELETE roles
            [
                'code' => 'API:delete-ads',
                'label' => [
                    'en' => 'Delete Advertisements',
                    'ar' => 'حذف الإعلانات',
                    'fr' => 'Supprimer les publicités',
                    'es' => 'Eliminar anuncios',
                ]
            ],
            [
                'code' => 'API:delete-news',
                'label' => [
                    'en' => 'Delete News',
                    'ar' => 'حذف الأخبار',
                    'fr' => 'Supprimer les actualités',
                    'es' => 'Eliminar noticias',
                ]
            ],
            [
                'code' => 'API:delete-events',
                'label' => [
                    'en' => 'Delete Events',
                    'ar' => 'حذف الأحداث',
                    'fr' => 'Supprimer les événements',
                    'es' => 'Eliminar eventos',
                ]
            ],
            [
                'code' => 'API:delete-papers',
                'label' => [
                    'en' => 'Delete Papers',
                    'ar' => 'حذف الأوراق',
                    'fr' => 'Supprimer les documents',
                    'es' => 'Eliminar documentos',
                ]
            ],
            [
                'code' => 'API:delete-persons',
                'label' => [
                    'en' => 'Delete Persons',
                    'ar' => 'حذف الأشخاص',
                    'fr' => 'Supprimer les personnes',
                    'es' => 'Eliminar personas',
                ]
            ],
            [
                'code' => 'API:delete-potentials',
                'label' => [
                    'en' => 'Delete Potentials',
                    'ar' => 'حذف الإمكانيات',
                    'fr' => 'Supprimer le potentiel',
                    'es' => 'Eliminar potenciales',
                ]
            ],
            [
                'code' => 'API:delete-quick-links',
                'label' => [
                    'en' => 'Delete Quick Links',
                    'ar' => 'حذف الروابط السريعة',
                    'fr' => 'Supprimer les liens rapides',
                    'es' => 'Eliminar enlaces rápidos',
                ]
            ],
            [
                'code' => 'API:delete-important-numbers',
                'label' => [
                    'en' => 'Delete Important Numbers',
                    'ar' => 'حذف الأرقام المهمة',
                    'fr' => 'Supprimer les numéros importants',
                    'es' => 'Eliminar números importantes',
                ]
            ],
            [
                'code' => 'API:delete-home-images',
                'label' => [
                    'en' => 'Delete Home Images',
                    'ar' => 'حذف صور الصفحة الرئيسية',
                    'fr' => 'Supprimer les images d\'accueil',
                    'es' => 'Eliminar imágenes de inicio',
                ]
            ],
            // System Management Roles
            [
                'code' => 'API:manage-users',
                'label' => [
                    'en' => 'Manage Users',
                    'ar' => 'إدارة المستخدمين',
                    'fr' => 'Gérer les utilisateurs',
                    'es' => 'Administrar usuarios',
                ]
            ],
            [
                'code' => 'API:manage-roles',
                'label' => [
                    'en' => 'Manage Roles',
                    'ar' => 'إدارة الأدوار',
                    'fr' => 'Gérer les rôles',
                    'es' => 'Administrar roles',
                ]
            ],
            [
                'code' => 'API:manage-groups',
                'label' => [
                    'en' => 'Manage Groups',
                    'ar' => 'إدارة المجموعات',
                    'fr' => 'Gérer les groupes',
                    'es' => 'Administrar grupos',
                ]
            ],
            [
                'code' => 'API:manage-structures',
                'label' => [
                    'en' => 'Manage Structures',
                    'ar' => 'إدارة الهياكل',
                    'fr' => 'Gérer les structures',
                    'es' => 'Administrar estructuras',
                ]
            ],
            [
                'code' => 'API:manage-modules',
                'label' => [
                    'en' => 'Manage Modules',
                    'ar' => 'إدارة الوحدات',
                    'fr' => 'Gérer les modules',
                    'es' => 'Administrar módulos',
                ]
            ],
            [
                'code' => 'API:manage-claims',
                'label' => [
                    'en' => 'Manage Claims',
                    'ar' => 'إدارة المطالبات',
                    'fr' => 'Gérer les réclamations',
                    'es' => 'Administrar reclamaciones',
                ]
            ],
            [
                'code' => 'API:superadmin',
                'label' => [
                    'en' => 'Super Admin Access',
                    'ar' => 'وصول المسؤول الأعلى',
                    'fr' => 'Accès super administrateur',
                    'es' => 'Acceso de superadministrador',
                ]
            ],
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
                'code' => 'MODULE:admin-tools',
                'label' => [
                    'en' => 'Admin Tools Access',
                    'ar' => 'الوصول إلى أدوات الإدارة',
                    'fr' => 'Accès aux outils admin',
                    'es' => 'Acceso a herramientas de administración',
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
