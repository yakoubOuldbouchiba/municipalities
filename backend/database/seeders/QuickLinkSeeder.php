<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\QuickLink;

class QuickLinkSeeder extends Seeder
{
    public function run(): void
    {
        QuickLink::insert([
            [
                'label' => json_encode([
                    "en" => "Ministry of Interior",
                    "fr" => "Ministère de l'Intérieur",
                    "ar" => "وزارة الداخلية",
                    "es" => "Ministerio del Interior"
                ]),
                'url' => 'https://www.interieur.gov.dz/index.php/fr/'
            ],
            [
                'label' => json_encode([
                    "en" => "National Defense",
                    "fr" => "Défense Nationale",
                    "ar" => "وزارة الدفاع الوطني",
                    "es" => "Defensa Nacional"
                ]),
                'url' => 'https://www.mdn.dz/site_principal/accueil_fr.php'
            ],
            [
                'label' => json_encode([
                    "en" => "National Police",
                    "fr" => "Police Nationale",
                    "ar" => "المديرية العامة للأمن الوطني",
                    "es" => "Policía Nacional"
                ]),
                'url' => 'https://www.algeriepolice.dz/'
            ],
            [
                'label' => json_encode([
                    "en" => "Civil Protection",
                    "fr" => "Protection Civile",
                    "ar" => "الحماية المدنية",
                    "es" => "Protección Civil"
                ]),
                'url' => 'https://dgpc.dz/'
            ],
        ]);
    }
}
