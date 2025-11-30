<?php 
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Paper;

class PaperSeeder extends Seeder
{
    public function run(): void
    {
        Paper::insert([
            [
                'slug' => 'identity',
                'titles' => json_encode(["en" => "Identity Card", "ar" => "بطاقة التعريف الوطنية", "fr" => "Carte d'identité nationale", "es" => "Cédula de identidad"]),
                'descriptions' => json_encode(["en" => "How to apply for or renew your ID card.", "ar" => "كيفية طلب أو تجديد بطاقة التعريف الوطنية.", "fr" => "Comment demander ou renouveler votre carte d'identité.", "es" => "Cómo solicitar o renovar su cédula de identidad."]),
            ],
            [
                'slug' => 'driving',
                'titles' => json_encode(["en" => "Driving License", "ar" => "رخصة السياقة", "fr" => "Permis de conduire", "es" => "Licencia de conducir"]),
                'descriptions' => json_encode(["en" => "Information about obtaining or renewing a driving license.", "ar" => "معلومات حول الحصول على رخصة السياقة أو تجديدها.", "fr" => "Informations sur l'obtention ou le renouvellement du permis de conduire.", "es" => "Información sobre obtener o renovar una licencia de conducir."]),
            ],
            [
                'slug' => 'housing',
                'titles' => json_encode(["en" => "Housing Certificate", "ar" => "شهادة السكن", "fr" => "Certificat de résidence", "es" => "Certificado de residencia"]),
                'descriptions' => json_encode(["en" => "Steps to obtain a housing certificate.", "ar" => "خطوات الحصول على شهادة السكن.", "fr" => "Étapes pour obtenir un certificat de résidence.", "es" => "Pasos para obtener un certificado de residencia."]),
            ],
            [
                'slug' => 'family',
                'titles' => json_encode(["en" => "Family Book", "ar" => "دفتر العائلة", "fr" => "Livret de famille", "es" => "Libro de familia"]),
                'descriptions' => json_encode(["en" => "Procedure to request a family book.", "ar" => "إجراءات طلب دفتر العائلة.", "fr" => "Procédure pour demander un livret de famille.", "es" => "Procedimiento para solicitar un libro de familia."]),
          ]
        ]);
    }
}
