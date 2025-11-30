<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $news = [
            [
                'title' => json_encode(['en' => 'Municipality launches digital services', 'ar' => 'البلدية تطلق الخدمات الرقمية', 'fr' => 'La municipalité lance les services numériques', 'es' => 'El municipio lanza servicios digitales']),
                'description' => json_encode(['en' => 'Access online forms and procedures directly from our website. This new initiative aims to improve citizen engagement and streamline municipal services.', 'ar' => 'الوصول إلى النماذج والإجراءات عبر الإنترنت مباشرة من موقعنا. تهدف هذه المبادرة الجديدة إلى تحسين مشاركة المواطنين وتبسيط الخدمات البلدية.', 'fr' => 'Accédez aux formulaires et procédures en ligne directement depuis notre site web. Cette nouvelle initiative vise à améliorer l\'engagement des citoyens et à rationaliser les services municipaux.', 'es' => 'Acceda a formularios y procedimientos en línea directamente desde nuestro sitio web. Esta nueva iniciativa tiene como objetivo mejorar la participación de los ciudadanos y agilizar los servicios municipales.']),
                'fileUrl' => 'https://unej.dz/savedIMG/images/pages/l4qrj2s6SRRMULLS1RS.jpeg',
            ],
            [
                'title' => json_encode(['en' => 'New infrastructure project completed', 'ar' => 'تم الانتهاء من مشروع البنية التحتية الجديد', 'fr' => 'Nouveau projet d\'infrastructure terminé', 'es' => 'Nuevo proyecto de infraestructura completado']),
                'description' => json_encode(['en' => 'The central district infrastructure project has been successfully completed ahead of schedule. The new water treatment facility will serve 50,000 residents.', 'ar' => 'تم الانتهاء بنجاح من مشروع البنية التحتية في الحي المركزي قبل الموعد المحدد. ستخدم محطة معالجة المياه الجديدة 50000 نسمة.', 'fr' => 'Le projet d\'infrastructure du district central a été achevé avec succès avant le délai prévu. La nouvelle usine de traitement de l\'eau servira 50 000 habitants.', 'es' => 'El proyecto de infraestructura del distrito central se completó exitosamente antes de lo previsto. La nueva planta de tratamiento de agua servirá a 50.000 residentes.']),
                'fileUrl' => 'https://unej.dz/savedIMG/images/pages/l4qrj2s6SRRMULLS1RS.jpeg',
            ],
            [
                'title' => json_encode(['en' => 'Budget announcement for fiscal year 2024', 'ar' => 'إعلان الميزانية للسنة المالية 2024', 'fr' => 'Annonce du budget pour l\'exercice fiscal 2024', 'es' => 'Anuncio del presupuesto para el año fiscal 2024']),
                'description' => json_encode(['en' => 'The municipality has announced its fiscal budget with a focus on education, healthcare, and sustainable development. Total allocation is 500 million dinars.', 'ar' => 'أعلنت البلدية عن ميزانيتها مع التركيز على التعليم والرعاية الصحية والتنمية المستدامة. إجمالي التخصيص 500 مليون دينار.', 'fr' => 'La municipalité a annoncé son budget avec un accent sur l\'éducation, la santé et le développement durable. L\'allocation totale est de 500 millions de dinars.', 'es' => 'El municipio ha anunciado su presupuesto con énfasis en educación, atención médica y desarrollo sostenible. La asignación total es de 500 millones de dinares.']),
                'fileUrl' => 'https://unej.dz/savedIMG/images/pages/l4qrj2s6SRRMULLS1RS.jpeg',
            ],
        ];

        News::insert($news);
    }
}
