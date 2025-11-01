<?php 
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Paper;

class PaperSeeder extends Seeder
{
    public function run(): void
    {
        $papers = [
            [
                'slug' => 'identity',
                'titles' => [
                    'en' => 'Identity Card',
                    'ar' => 'بطاقة التعريف الوطنية',
                    'fr' => 'Carte d’identité nationale',
                ],
                'descriptions' => [
                    'en' => 'How to apply for or renew your ID card.',
                    'ar' => 'كيفية طلب أو تجديد بطاقة التعريف الوطنية.',
                    'fr' => 'Comment demander ou renouveler votre carte d’identité.',
                ],
            ],
            [
                'slug' => 'driving',
                'titles' => [
                    'en' => 'Driving License',
                    'ar' => 'رخصة السياقة',
                    'fr' => 'Permis de conduire',
                ],
                'descriptions' => [
                    'en' => 'Information about obtaining or renewing a driving license.',
                    'ar' => 'معلومات حول الحصول على رخصة السياقة أو تجديدها.',
                    'fr' => 'Informations sur l’obtention ou le renouvellement du permis de conduire.',
                ],
            ],
            [
                'slug' => 'housing',
                'titles' => [
                    'en' => 'Housing Certificate',
                    'ar' => 'شهادة السكن',
                    'fr' => 'Certificat de résidence',
                ],
                'descriptions' => [
                    'en' => 'Steps to obtain a housing certificate.',
                    'ar' => 'خطوات الحصول على شهادة السكن.',
                    'fr' => 'Étapes pour obtenir un certificat de résidence.',
                ],
            ],
            [
                'slug' => 'family',
                'titles' => [
                    'en' => 'Family Book',
                    'ar' => 'دفتر العائلة',
                    'fr' => 'Livret de famille',
                ],
                'descriptions' => [
                    'en' => 'Procedure to request a family book.',
                    'ar' => 'إجراءات طلب دفتر العائلة.',
                    'fr' => 'Procédure pour demander un livret de famille.',
                ],
            ],
        ];

        foreach ($papers as $paper) {
            Paper::create($paper);
        }
    }
}
