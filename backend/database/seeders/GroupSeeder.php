<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin Group - has all roles
        $adminGroup = Group::create([
            'code' => 'ADMIN',
            'label' => [
                'en' => 'Admin Group',
                'ar' => 'مجموعة المسؤولين',
                'fr' => 'Groupe Administrateur',
                'es' => 'Grupo de Administrador'
            ]
        ]);
        
        // Attach all roles to admin group
        $allRoles = Role::all();
        $adminGroup->roles()->attach($allRoles->pluck('id'));

        // Create Editor Group - has website and documents editing roles
        $editorGroup = Group::create([
            'code' => 'EDITOR',
            'label' => [
                'en' => 'Editor Group',
                'ar' => 'مجموعة المحررين',
                'fr' => 'Groupe Éditeur',
                'es' => 'Grupo de Editores'
            ]
        ]);
        
        // Attach website and document roles to editor group
        $editorRoles = Role::where('code', 'like', 'NAV:website%')
            ->orWhere('code', 'like', 'NAV:documents%')
            ->get();
        $editorGroup->roles()->attach($editorRoles->pluck('id'));

        // Create Viewer Group - read-only access
        $viewerGroup = Group::create([
            'code' => 'VIEWER',
            'label' => [
                'en' => 'Viewer Group',
                'ar' => 'مجموعة العارضين',
                'fr' => 'Groupe Lecteur',
                'es' => 'Grupo de Visualización'
            ]
        ]);
        
        // Attach only module-level roles to viewer group (no specific nav item roles)
        $viewerRoles = Role::where('code', 'like', 'NAV:%')
            ->where('code', 'not like', '%-%')  // Only module-level roles (no nav item IDs)
            ->get();
        $viewerGroup->roles()->attach($viewerRoles->pluck('id'));

        // Create Claims Group - specific to claims module
        $claimsGroup = Group::create([
            'code' => 'CLAIMS_OFFICER',
            'label' => [
                'en' => 'Claims Officer Group',
                'ar' => 'مجموعة موظفي المطالبات',
                'fr' => 'Groupe Responsable des Sinistres',
                'es' => 'Grupo de Encargados de Reclamaciones'
            ]
        ]);
        
        // Attach claims module roles
        $claimsRoles = Role::where('code', 'like', 'NAV:claims%')->get();
        $claimsGroup->roles()->attach($claimsRoles->pluck('id'));
    }
}
