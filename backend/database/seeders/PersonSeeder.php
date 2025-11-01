<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Person;

class PersonSeeder extends Seeder
{
    public function run(): void
    {
        // current mayor
        Person::create([
            'type' => 'mayor',
            'names' => ['en' => 'Ali Bouzid', 'ar' => 'علي بوزيد', 'fr' => 'Ali Bouzid'],
            'messages' => ['en' => 'As mayor, I am committed to sustainable development.', 'ar' => 'كرئيس لبلدية، ألتزم بالتنمية المستدامة.'],
            'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
            'is_current' => true,
        ]);

        // mayor history
        Person::create([
            'type' => 'mayor',
            'names' => ['en' => 'Mourad Bensalem', 'ar' => 'مراد بن سالم'],
            'period' => '2018 - 2023',
            'achievements' => ['en' => 'Upgraded local infrastructure.', 'ar' => 'ترقية البنية التحتية المحلية.'],
        ]);

        // current secretary-general
        Person::create([
            'type' => 'secretary_general',
            'names' => ['en' => 'Fatima Cherif', 'ar' => 'فاطمة شريف'],
            'messages' => ['en' => 'Committed to transparency and service excellence.', 'ar' => 'ملتزمة بالشفافية وجودة الخدمة.'],
            'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
            'is_current' => true,
        ]);

        // secretary-general history
        Person::create([
            'type' => 'secretary_general',
            'names' => ['en' => 'Samir Khellaf', 'ar' => 'سمير خلاف'],
            'period' => '2015 - 2022',
            'achievements' => ['en' => 'Digitized administrative processes.', 'ar' => 'رقمنة العمليات الإدارية.'],
        ]);
    }
}
