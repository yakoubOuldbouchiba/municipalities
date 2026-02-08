<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Group;
use App\Models\Structure;
use App\Models\Module;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all roles, groups, and structures
        $allRoles = Role::all();
        $allGroups = Group::all();
        $allStructures = Structure::all();

        // Create or update Admin User with all roles, groups, and structures
        $admin = User::updateOrCreate(
            ['email' => 'admin@baladia.local'],
            [
                'firstname' => json_encode(['en' => 'Admin', 'fr' => 'Administrateur', 'ar' => 'مسؤول']),
                'lastname' => json_encode(['en' => 'User', 'fr' => 'Utilisateur', 'ar' => 'مستخدم']),
                'name' => 'Admin User',
                'password' => Hash::make('password123'),
                'nin' => '00000000000',
                'phone' => '+213612345678',
                'iphone' => '+213612345679',
                'birthdate' => '1990-01-01',
                'birthplace' => json_encode(['en' => 'Algiers', 'fr' => 'Alger', 'ar' => 'الجزائر']),
                'gender' => 'male',
                'photo' => null,
                'address' => json_encode([
                    'en' => ['city' => 'Algiers', 'country' => 'Algeria'],
                    'fr' => ['city' => 'Alger', 'country' => 'Algérie'],
                    'ar' => ['city' => 'الجزائر', 'country' => 'الجزائر']
                ]),
                'active' => true,
            ]
        );

        // Sync all roles, groups, and structures to admin
        if ($allRoles->count() > 0) {
            $admin->roles()->sync($allRoles->pluck('id')->toArray());
        }
        if ($allGroups->count() > 0) {
            $admin->groups()->sync($allGroups->pluck('id')->toArray());
        }
        if ($allStructures->count() > 0) {
            $admin->structures()->sync($allStructures->pluck('id')->toArray());
        }

        $this->command->info('✓ Admin user created: admin@baladia.local (all roles)');

        // Create module-specific users based on actual modules
        $modules = Module::all();

        // Mapping of modules to API resource roles
        $moduleToApiRoles = [
            'admin' => ['API:manage-users', 'API:manage-roles', 'API:manage-groups', 'API:manage-structures', 'API:manage-modules'],
            'website' => ['API:write-ads', 'API:write-news', 'API:write-papers', 'API:write-potentials', 'API:write-events', 'API:write-persons', 'API:write-quick-links', 'API:write-important-numbers', 'API:write-home-images'],
            'claims' => ['API:manage-claims'],
            'documents' => ['API:write-papers'],
            'admin-tools' => ['API:superadmin'],
        ];

        foreach ($modules as $module) {
            $firstNameLabel = is_array($module->label) ? ($module->label['en'] ?? $module->code) : $module->code;
            $managerEmail = 'manager_' . strtolower($module->code) . '@baladia.local';
            
            $user = User::updateOrCreate(
                ['email' => $managerEmail],
                [
                    'firstname' => json_encode(['en' => $firstNameLabel, 'fr' => $firstNameLabel, 'ar' => $firstNameLabel]),
                    'lastname' => json_encode(['en' => 'Manager', 'fr' => 'Gestionnaire', 'ar' => 'مدير']),
                    'name' => $firstNameLabel . ' Manager',
                    'password' => Hash::make('password123'),
                    'nin' => sprintf('NIN%08d', rand(10000000, 99999999)),
                    'phone' => '+213' . rand(600000000, 699999999),
                    'iphone' => null,
                    'birthdate' => '1995-' . str_pad(rand(1, 12), 2, '0', STR_PAD_LEFT) . '-' . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT),
                    'birthplace' => json_encode(['en' => 'Algeria', 'fr' => 'Algérie', 'ar' => 'الجزائر']),
                    'gender' => rand(0, 1) ? 'male' : 'female',
                    'photo' => null,
                    'address' => json_encode([
                        'en' => ['city' => 'Oran', 'country' => 'Algeria'],
                        'fr' => ['city' => 'Oran', 'country' => 'Algérie'],
                        'ar' => ['city' => 'وهران', 'country' => 'الجزائر']
                    ]),
                    'active' => true,
                ]
            );

            // Find role matching MODULE:modulecode pattern
            $moduleRoleCode = 'MODULE:' . $module->code;
            $moduleRole = $allRoles->firstWhere('code', $moduleRoleCode);
            $roleIds = [];
            
            if ($moduleRole) {
                $roleIds[] = $moduleRole->id;
            }

            // Get all nav items for this module and attach their roles
            $navItems = $module->navItems()->get();
            foreach ($navItems as $navItem) {
                $navItemRoles = $navItem->roles()->select('roles.id')->pluck('roles.id')->toArray();
                $roleIds = array_merge($roleIds, $navItemRoles);
            }

            // Grant API roles based on module
            $moduleCode = strtolower($module->code);
            if (isset($moduleToApiRoles[$moduleCode])) {
                foreach ($moduleToApiRoles[$moduleCode] as $apiRoleCode) {
                    $apiRole = $allRoles->firstWhere('code', $apiRoleCode);
                    if ($apiRole) {
                        $roleIds[] = $apiRole->id;
                    }
                }
            }

            // Sync all collected roles to user
            if (!empty($roleIds)) {
                $user->roles()->sync(array_unique($roleIds));
            }

            // Sync first group and structure
            if ($allGroups->count() > 0) {
                $user->groups()->sync([$allGroups->first()->id]);
            }
            if ($allStructures->count() > 0) {
                $user->structures()->sync([$allStructures->first()->id]);
            }

            $roleCount = count(array_unique($roleIds));
            $this->command->info("✓ manager_{$module->code}@baladia.local ($roleCount roles)");
        }

        $this->command->info('✅ UserSeeder completed successfully!');
        $this->command->info('Default password: password123');
    }
}
