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

        // Create Admin User with all roles, groups, and structures
        $admin = User::create([
            'firstname' => json_encode(['en' => 'Admin', 'fr' => 'Administrateur', 'ar' => 'مسؤول']),
            'lastname' => json_encode(['en' => 'User', 'fr' => 'Utilisateur', 'ar' => 'مستخدم']),
            'name' => 'Admin User',
            'email' => 'admin@baladia.local',
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
        ]);

        // Attach all roles, groups, and structures to admin
        if ($allRoles->count() > 0) {
            $admin->roles()->attach($allRoles->pluck('id')->toArray());
        }
        if ($allGroups->count() > 0) {
            $admin->groups()->attach($allGroups->pluck('id')->toArray());
        }
        if ($allStructures->count() > 0) {
            $admin->structures()->attach($allStructures->pluck('id')->toArray());
        }

        $this->command->info('✓ Admin user created: admin@baladia.local');

        // Create module-specific users based on actual modules
        $modules = Module::all();

        foreach ($modules as $module) {
            $firstNameLabel = is_array($module->label) ? ($module->label['en'] ?? $module->code) : $module->code;
            
            $user = User::create([
                'firstname' => json_encode(['en' => $firstNameLabel, 'fr' => $firstNameLabel, 'ar' => $firstNameLabel]),
                'lastname' => json_encode(['en' => 'Manager', 'fr' => 'Gestionnaire', 'ar' => 'مدير']),
                'name' => $firstNameLabel . ' Manager',
                'email' => 'manager_' . strtolower($module->code) . '@baladia.local',
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
            ]);

            // Find role matching module code if exists
            $moduleRole = $allRoles->firstWhere('code', $module->code);
            $roleCode = $moduleRole ? $moduleRole->code : 'no role';
            
            if ($moduleRole) {
                $user->roles()->attach($moduleRole->id);
            } else if ($allRoles->count() > 0) {
                // Attach first available role as fallback
                $user->roles()->attach($allRoles->first()->id);
            }

            // Attach first group and structure
            if ($allGroups->count() > 0) {
                $user->groups()->attach($allGroups->first()->id);
            }
            if ($allStructures->count() > 0) {
                $user->structures()->attach($allStructures->first()->id);
            }

            $this->command->info("✓ Created user for module: {$module->code} ({$roleCode})");
        }

        $this->command->info('✅ UserSeeder completed successfully!');
        $this->command->info('Password for all users: password123');
    }
}
