<?php

namespace Database\Seeders;

use App\Models\HomeImage;
use Illuminate\Database\Seeder;

class HomeImageSeeder extends Seeder
{
    public function run(): void
    {
        HomeImage::insert([
            [
                'url' => 'https://d3mc2wqt0g7xc3.cloudfront.net/media-test/point26588.jpg',
                'captions' => json_encode([
                    'en' => 'Beautiful beaches of Zemmouri',
                    'fr' => 'Belles plages de Zemmouri',
                    'ar' => 'شواطئ زموري الجميلة'
                ]),
            ],
            [
                'url' => 'https://statics.getnofilter.com/photos/small/bf42f00d-7d0b-42b7-86a8-53d98b3b4c6c.webp',
                'captions' => json_encode([
                    'en' => 'The heart of Zemmouri',
                    'fr' => 'Le cœur de Zemmouri',
                    'ar' => 'قلب زموري'
                ]),
            ],
            [
                'url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/DZ_35_Zemmouri.svg/2560px-DZ_35_Zemmouri.svg.png',
                'captions' => json_encode([
                    'en' => 'Traditional architecture and culture',
                    'fr' => 'Architecture et culture traditionnelles',
                    'ar' => 'الهندسة المعمارية والثقافة التقليدية'
                ]),
            ],
        ]);
    }
}
