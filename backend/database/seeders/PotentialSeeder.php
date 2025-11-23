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
                'title' => json_encode(['en' => 'Tourism', 'ar' => 'السياحة']),
                'description' => json_encode([
                    'en' => 'The region offers beautiful natural landscapes and historical sites that attract visitors year-round.',
                    'ar' => 'تتميز المنطقة بمناظر طبيعية خلابة ومواقع تاريخية تجذب الزوار طوال العام.'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'agriculture',
                'title' => json_encode(['en' => 'Agriculture', 'ar' => 'الزراعة']),
                'description' => json_encode([
                    'en' => 'Rich agricultural lands support the growth of olives, citrus fruits, and vegetables.',
                    'ar' => 'الأراضي الزراعية الخصبة تدعم زراعة الزيتون والحمضيات والخضروات.'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'urban',
                'title' => json_encode(['en' => 'Urban Development', 'ar' => 'التنمية الحضرية']),
                'description' => json_encode([
                    'en' => 'Urban projects aim to modernize infrastructure and improve public facilities.',
                    'ar' => 'تسعى المشاريع الحضرية إلى تحديث البنية التحتية وتحسين المرافق العامة.'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'education',
                'title' => json_encode(['en' => 'Education', 'ar' => 'التعليم']),
                'description' => json_encode([
                    'en' => 'The municipality provides quality education with multiple schools and training centers.',
                    'ar' => 'توفر البلدية تعليماً جيداً من خلال المدارس ومراكز التدريب المتنوعة.'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'slug' => 'environment',
                'title' => json_encode(['en' => 'Environment', 'ar' => 'البيئة']),
                'description' => json_encode([
                    'en' => 'Efforts are ongoing to preserve green spaces and promote environmental awareness.',
                    'ar' => 'تبذل جهود مستمرة للحفاظ على المساحات الخضراء ونشر الوعي البيئي.'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
