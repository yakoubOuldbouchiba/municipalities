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
                'title' => 'Municipality launches digital services',
                'description' => 'Access online forms and procedures directly from our website.',
                'link' => 'https://unej.dz/savedIMG/images/pages/l4qrj2s6SRRMULLS1RS.jpeg',
                'file_type' => 'image',
            ],
            [
                'title' => 'New road renovation project approved',
                'description' => 'Work begins next month in the central district.',
                'link' => 'https://unej.dz/savedIMG/images/pages/l4qrj2s6SRRMULLS1RS.jpeg',
                'file_type' => 'image',
            ],
            [
                'title' => 'Public meeting with the Mayor this Sunday',
                'description' => 'Join the open session to discuss community improvements.',
                'link' => 'https://unej.dz/savedIMG/images/pages/l4qrj2s6SRRMULLS1RS.jpeg',
                'file_type' => 'image',
            ],
        ];

        Ad::insert($ads);
    }
}
