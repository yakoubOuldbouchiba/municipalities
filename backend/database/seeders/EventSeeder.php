<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            [
                'status' => 'Foundation',
                'date' => '18th Century',
                'description' => [
                    'en' => 'Zemmouri was established as a coastal town known for fishing and trade along the Mediterranean Sea.',
                    'fr' => 'Zemmouri a été fondée comme une ville côtière connue pour la pêche et le commerce le long de la mer Méditerranée.',
                    'ar' => 'تأسست زموري كمدينة ساحلية معروفة بالصيد والتجارة على طول البحر الأبيض المتوسط.',
                ],
                'icon' => 'pi pi-flag',
                'color' => '#16a34a',
            ],
            [
                'status' => 'Colonial Era',
                'date' => '1830 - 1962',
                'description' => [
                    'en' => 'During the French colonization, Zemmouri became a strategic port and saw major urban expansion.',
                    'fr' => 'Pendant la colonisation française, Zemmouri est devenue un port stratégique et a connu une grande expansion urbaine.',
                    'ar' => 'خلال الاستعمار الفرنسي، أصبحت زموري ميناءً استراتيجياً وشهدت توسعاً عمرانياً كبيراً.',
                ],
                'icon' => 'pi pi-building',
                'color' => '#16a34a',
            ],
            [
                'status' => 'Independence',
                'date' => '1962',
                'description' => [
                    'en' => 'After Algeria’s independence, Zemmouri embraced new development and modernization projects.',
                    'fr' => 'Après l’indépendance de l’Algérie, Zemmouri a adopté de nouveaux projets de développement et de modernisation.',
                    'ar' => 'بعد استقلال الجزائر، تبنت زموري مشاريع تنموية وتحديثية جديدة.',
                ],
                'icon' => 'pi pi-star',
                'color' => '#16a34a',
            ],
            [
                'status' => 'Modern Growth',
                'date' => '2000 - Present',
                'description' => [
                    'en' => 'Zemmouri continues to grow sustainably, focusing on tourism, environment, and digital governance.',
                    'fr' => 'Zemmouri continue de croître durablement, en se concentrant sur le tourisme, l’environnement et la gouvernance numérique.',
                    'ar' => 'تواصل زموري نموها المستدام، مع التركيز على السياحة والبيئة والحكامة الرقمية.',
                ],
                'icon' => 'pi pi-globe',
                'color' => '#16a34a',
            ],
        ];

        foreach ($events as $data) {
            Event::create($data);
        }
    }
}
