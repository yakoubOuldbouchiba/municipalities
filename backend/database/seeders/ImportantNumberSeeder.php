<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\ImportantNumber;

class ImportantNumberSeeder extends Seeder
{
    public function run(): void
    {
        ImportantNumber::insert([
            [
                'label' => json_encode([
                    'en' => 'Police',
                    'fr' => 'Police',
                    'ar' => 'الشرطة'
                ]),
                'value' => '1548'
            ],
            [
                'label' => json_encode([
                    'en' => 'Firefighters',
                    'fr' => 'Pompiers',
                    'ar' => 'الحماية المدنية'
                ]),
                'value' => '14'
            ],
            [
                'label' => json_encode([
                    'en' => 'Hospital',
                    'fr' => 'Hôpital',
                    'ar' => 'المستشفى'
                ]),
                'value' => '+213 24 79 00 00'
            ],
            [
                'label' => json_encode([
                    'en' => 'Municipality',
                    'fr' => 'Mairie',
                    'ar' => 'البلدية'
                ]),
                'value' => '+213 24 79 12 34'
            ],
        ]);
    }
}
