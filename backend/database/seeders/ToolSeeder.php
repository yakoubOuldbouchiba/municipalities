<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tool;
use App\Models\Role;

class ToolSeeder extends Seeder
{
    public function run(): void
    {
        // Create tools
        $tools = [
            [
                'code' => 'phpmyadmin',
                'label' => json_encode([
                    'en' => 'phpMyAdmin',
                    'ar' => 'phpMyAdmin',
                    'fr' => 'phpMyAdmin',
                    'es' => 'phpMyAdmin'
                ]),
                'description' => json_encode([
                    'en' => 'Database management tool',
                    'ar' => 'أداة إدارة قاعدة البيانات',
                    'fr' => 'Outil de gestion de base de données',
                    'es' => 'Herramienta de gestión de bases de datos'
                ]),
                'icon' => 'pi pi-database',
                'url' => 'http://localhost:8080',
                'color' => '#3B82F6',
                'order' => 1,
            ],
            [
                'code' => 'grafana',
                'label' => json_encode([
                    'en' => 'Grafana',
                    'ar' => 'جرافانا',
                    'fr' => 'Grafana',
                    'es' => 'Grafana'
                ]),
                'description' => json_encode([
                    'en' => 'System monitoring and visualization',
                    'ar' => 'مراقبة النظام والتصور',
                    'fr' => 'Surveillance système et visualisation',
                    'es' => 'Monitoreo del sistema y visualización'
                ]),
                'icon' => 'pi pi-chart-line',
                'url' => 'http://localhost:3001',
                'color' => '#F59E0B',
                'order' => 2,
            ],
            [
                'code' => 'prometheus',
                'label' => json_encode([
                    'en' => 'Prometheus',
                    'ar' => 'بروميثيوس',
                    'fr' => 'Prometheus',
                    'es' => 'Prometeo'
                ]),
                'description' => json_encode([
                    'en' => 'Metrics collection and querying',
                    'ar' => 'جمع وتسأل المقاييس',
                    'fr' => 'Collection et interrogation des métriques',
                    'es' => 'Recopilación y consulta de métricas'
                ]),
                'icon' => 'pi pi-server',
                'url' => 'http://localhost:9090',
                'color' => '#EC4899',
                'order' => 3,
            ],
            [
                'code' => 'redis-commander',
                'label' => json_encode([
                    'en' => 'Redis Commander',
                    'ar' => 'قائد Redis',
                    'fr' => 'Redis Commander',
                    'es' => 'Redis Commander'
                ]),
                'description' => json_encode([
                    'en' => 'Redis cache management',
                    'ar' => 'إدارة ذاكرة التخزين المؤقت Redis',
                    'fr' => 'Gestion du cache Redis',
                    'es' => 'Gestión de caché Redis'
                ]),
                'icon' => 'pi pi-circle',
                'url' => 'http://localhost:8001',
                'color' => '#EF4444',
                'order' => 4,
            ],
        ];

        foreach ($tools as $toolData) {
            $tool = Tool::create($toolData);
            
            // Create role for this tool (TOOLS:phpmyadmin, TOOLS:grafana, etc.)
            $roleCode = 'TOOLS:' . strtoupper($toolData['code']);
            $role = Role::firstOrCreate(
                ['code' => $roleCode],
                [
                    'label' => json_encode([
                        'en' => $toolData['label'] ? json_decode($toolData['label'], true)['en'] . ' Access' : $toolData['code'],
                        'ar' => 'الوصول إلى ' . (json_decode($toolData['label'], true)['ar'] ?? $toolData['code']),
                        'fr' => 'Accès ' . (json_decode($toolData['label'], true)['fr'] ?? $toolData['code']),
                        'es' => 'Acceso a ' . (json_decode($toolData['label'], true)['es'] ?? $toolData['code'])
                    ])
                ]
            );

            // Attach role to tool
            $tool->roles()->attach($role->id);
        }
    }
}
