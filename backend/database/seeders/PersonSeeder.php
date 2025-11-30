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
            'names' => json_encode(["en" => "Ali Bouzid", "ar" => "علي بوزيد", "fr" => "Ali Bouzid", "es" => "Ali Bouzid"]),
            'messages' => json_encode(["en" => "As mayor, I am committed to sustainable development.", "ar" => "كرئيس لبلدية، ألتزم بالتنمية المستدامة.", "fr" => "En tant que maire, je m'engage pour le développement durable.", "es" => "Como alcalde, me comprometo con el desarrollo sostenible."]),
            'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
            'is_current' => true,
        ]);

        // mayor history
        Person::create([
            'type' => 'mayor',
            'names' => json_encode(["en" => "Mourad Bensalem", "ar" => "مراد بن سالم", "fr" => "Mourad Bensalem", "es" => "Mourad Bensalem"]),
            'period' => '2018 - 2023',
            'achievements' => json_encode(["en" => "Upgraded local infrastructure.", "ar" => "ترقية البنية التحتية المحلية.", "fr" => "Amélioration de l'infrastructure locale.", "es" => "Actualización de la infraestructura local."]),
        ]);

        // current secretary-general
        Person::create([
            'type' => 'secretary_general',
            'names' => json_encode(["en" => "Fatima Cherif", "ar" => "فاطمة شريف", "fr" => "Fatima Cherif", "es" => "Fatima Cherif"]),
            'messages' => json_encode(["en" => "Committed to transparency and service excellence.", "ar" => "ملتزمة بالشفافية وجودة الخدمة.", "fr" => "Engagée envers la transparence et l'excellence du service.", "es" => "Comprometida con la transparencia y la excelencia del servicio."]),
            'image_url' => 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
            'is_current' => true,
        ]);

        // secretary-general history
        Person::create([
            'type' => 'secretary_general',
            'names' => json_encode(["en" => "Samir Khellaf", "ar" => "سمير خلاف", "fr" => "Samir Khellaf", "es" => "Samir Khellaf"]),
            'period' => '2015 - 2022',
            'achievements' => json_encode(["en" => "Digitized administrative processes.", "ar" => "رقمنة العمليات الإدارية.", "fr" => "Numérisation des processus administratifs.", "es" => "Digitalización de procesos administrativos."]),
        ]);
    }
}
