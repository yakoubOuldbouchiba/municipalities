<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Structure;

class StructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create parent structures with multilingual labels
        $principal = Structure::create([
            'label' => ['en' => 'Principal', 'fr' => 'Principal', 'ar' => 'مدير المدرسة', 'es' => 'Director'],
            'code' => 'PRINCIPAL',
            'id_parent' => null,
        ]);

        $director = Structure::create([
            'label' => ['en' => 'Director', 'fr' => 'Directeur', 'ar' => 'مدير', 'es' => 'Director'],
            'code' => 'DIRECTOR',
            'id_parent' => $principal->id,
        ]);

        $manager = Structure::create([
            'label' => ['en' => 'Manager', 'fr' => 'Gestionnaire', 'ar' => 'مدير', 'es' => 'Gerente'],
            'code' => 'MANAGER',
            'id_parent' => $director->id,
        ]);

        $supervisor = Structure::create([
            'label' => ['en' => 'Supervisor', 'fr' => 'Superviseur', 'ar' => 'مشرف', 'es' => 'Supervisor'],
            'code' => 'SUPERVISOR',
            'id_parent' => $manager->id,
        ]);

        // Create staff structures
        Structure::create([
            'label' => ['en' => 'Staff Member', 'fr' => 'Membre du Personnel', 'ar' => 'موظف', 'es' => 'Personal'],
            'code' => 'STAFF',
            'id_parent' => $supervisor->id,
        ]);

        Structure::create([
            'label' => ['en' => 'Intern', 'fr' => 'Stagiaire', 'ar' => 'متدرب', 'es' => 'Pasante'],
            'code' => 'INTERN',
            'id_parent' => $supervisor->id,
        ]);
    }
}
