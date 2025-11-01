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
                    'en' => 'Ministry of Interior',
                    'fr' => 'Ministère de l’Intérieur',
                    'ar' => 'وزارة الداخلية'
                ]),
                'url' => 'https://www.interieur.gov.dz/index.php/fr/'
            ],
            [
                'label' => json_encode([
                    'en' => 'National Defense',
                    'fr' => 'Défense Nationale',
                    'ar' => 'وزارة الدفاع الوطني'
                ]),
                'url' => 'https://www.mdn.dz/site_principal/accueil_fr.php'
            ],
            [
                'label' => json_encode([
                    'en' => 'National Police',
                    'fr' => 'Police Nationale',
                    'ar' => 'المديرية العامة للأمن الوطني'
                ]),
                'url' => 'https://www.algeriepolice.dz/'
            ],
            [
                'label' => json_encode([
                    'en' => 'Civil Protection',
                    'fr' => 'Protection Civile',
                    'ar' => 'الحماية المدنية'
                ]),
                'url' => 'https://dgpc.dz/'
            ],
        ]);
    }
}
