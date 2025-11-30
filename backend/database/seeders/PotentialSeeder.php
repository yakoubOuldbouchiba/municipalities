<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Potential;

class PotentialSeeder extends Seeder
{
    public function run(): void
    {
        Potential::insert([
            [
                'slug' => 'tourism',
                'title' => json_encode(['en' => 'Tourism', 'ar' => 'السياحة', 'fr' => 'Tourisme', 'es' => 'Turismo']),
                'description' => json_encode([
                    'en' => 'The region offers beautiful natural landscapes and historical sites that attract visitors year-round.',
                    'ar' => 'تتميز المنطقة بمناظر طبيعية خلابة ومواقع تاريخية تجذب الزوار طوال العام.',
                    'fr' => 'La région offre de beaux paysages naturels et des sites historiques qui attirent les visiteurs toute l\'année.',
                    'es' => 'La región ofrece hermosos paisajes naturales y sitios históricos que atraen a visitantes durante todo el año.'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'agriculture',
                'title' => json_encode(['en' => 'Agriculture', 'ar' => 'الزراعة', 'fr' => 'Agriculture', 'es' => 'Agricultura']),
                'description' => json_encode([
                    'en' => 'Rich agricultural lands support the growth of olives, citrus fruits, and vegetables.',
                    'ar' => 'الأراضي الزراعية الخصبة تدعم زراعة الزيتون والحمضيات والخضروات.',
                    'fr' => 'Les terres agricoles riches soutiennent la culture des olives, des agrumes et des légumes.',
                    'es' => 'Las tierras agrícolas ricas apoyan el cultivo de aceitunas, cítricos y verduras.'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'urban',
                'title' => json_encode(['en' => 'Urban Development', 'ar' => 'التنمية الحضرية', 'fr' => 'Développement urbain', 'es' => 'Desarrollo urbano']),
                'description' => json_encode([
                    'en' => 'Urban projects aim to modernize infrastructure and improve public facilities.',
                    'ar' => 'تسعى المشاريع الحضرية إلى تحديث البنية التحتية وتحسين المرافق العامة.',
                    'fr' => 'Les projets urbains visent à moderniser les infrastructures et améliorer les installations publiques.',
                    'es' => 'Los proyectos urbanos tienen como objetivo modernizar la infraestructura y mejorar las instalaciones públicas.'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'education',
                'title' => json_encode(['en' => 'Education', 'ar' => 'التعليم', 'fr' => 'Éducation', 'es' => 'Educación']),
                'description' => json_encode([
                    'en' => 'The municipality provides quality education with multiple schools and training centers.',
                    'ar' => 'توفر البلدية تعليماً جيداً من خلال المدارس ومراكز التدريب المتنوعة.',
                    'fr' => 'La municipalité fournit une éducation de qualité avec plusieurs écoles et centres de formation.',
                    'es' => 'El municipio proporciona educación de calidad con múltiples escuelas y centros de capacitación.'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'environment',
                'title' => json_encode(['en' => 'Environment', 'ar' => 'البيئة', 'fr' => 'Environnement', 'es' => 'Medio ambiente']),
                'description' => json_encode([
                    'en' => 'Efforts are ongoing to preserve green spaces and promote environmental awareness.',
                    'ar' => 'تبذل جهود مستمرة للحفاظ على المساحات الخضراء ونشر الوعي البيئي.',
                    'fr' => 'Des efforts sont en cours pour préserver les espaces verts et promouvoir la sensibilisation environnementale.',
                    'es' => 'Los esfuerzos son continuos para preservar espacios verdes y promover la conciencia ambiental.'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
