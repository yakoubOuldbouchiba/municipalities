<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ad;

class AdSeeder extends Seeder
{
    public function run(): void
    {
        $ads = [
            [
                'title' => json_encode(['en' => 'Municipality launches digital services', 'ar' => 'البلدية تطلق الخدمات الرقمية', 'fr' => 'La municipalité lance les services numériques', 'es' => 'El municipio lanza servicios digitales']),
                'description' => json_encode(['en' => 'Access online forms and procedures directly from our website.', 'ar' => 'الوصول إلى النماذج والإجراءات عبر الإنترنت مباشرة من موقعنا.', 'fr' => 'Accédez aux formulaires et procédures en ligne directement depuis notre site web.', 'es' => 'Acceda a formularios y procedimientos en línea directamente desde nuestro sitio web.']),
                'link' => 'https://unej.dz/savedIMG/images/pages/l4qrj2s6SRRMULLS1RS.jpeg',
                'file_type' => 'image',
            ],
            [
                'title' => json_encode(['en' => 'New road renovation project approved', 'ar' => 'تمت الموافقة على مشروع تجديد الطرق الجديد', 'fr' => 'Nouveau projet de rénovation routière approuvé', 'es' => 'Nuevo proyecto de renovación vial aprobado']),
                'description' => json_encode(['en' => 'Work begins next month in the central district.', 'ar' => 'تبدأ الأعمال الشهر المقبل في الحي المركزي.', 'fr' => 'Les travaux commencent le mois prochain dans le quartier central.', 'es' => 'El trabajo comienza el próximo mes en el distrito central.']),
                'link' => 'https://unej.dz/savedIMG/images/pages/l4qrj2s6SRRMULLS1RS.jpeg',
                'file_type' => 'image',
            ],
            [
                'title' => json_encode(['en' => 'Public meeting with the Mayor this Sunday', 'ar' => 'اجتماع عام مع العمدة يوم الأحد', 'fr' => 'Réunion publique avec le maire ce dimanche', 'es' => 'Reunión pública con el alcalde este domingo']),
                'description' => json_encode(['en' => 'Join the open session to discuss community improvements.', 'ar' => 'انضم إلى الجلسة المفتوحة لمناقشة تحسينات المجتمع.', 'fr' => 'Participez à la session ouverte pour discuter des améliorations communautaires.', 'es' => 'Únase a la sesión abierta para discutir mejoras comunitarias.']),
                'link' => 'https://unej.dz/savedIMG/images/pages/l4qrj2s6SRRMULLS1RS.jpeg',
                'file_type' => 'image',
            ],
        ];

        Ad::insert($ads);
    }
}
