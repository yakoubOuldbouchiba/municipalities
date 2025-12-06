<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class SuperAdminController extends Controller
{
    /**
     * Get all databases
     */
    public function getDatabases()
    {
        try {
            $databases = DB::select('SHOW DATABASES');
            $dbNames = array_map(function ($db) {
                return array_values((array) $db)[0];
            }, $databases);

            // Filter out system databases
            $userDatabases = array_filter($dbNames, function ($db) {
                return !in_array($db, ['information_schema', 'mysql', 'performance_schema', 'sys']);
            });

            return response()->json([
                'databases' => array_values($userDatabases)
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get tables for a specific database
     */
    public function getTables($database)
    {
        try {
            $tables = DB::select("SELECT TABLE_NAME as name, TABLE_ROWS as rows, ENGINE as engine, ROUND(((data_length + index_length) / 1024 / 1024), 2) as size FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?", [$database]);

            $info = DB::select("SELECT DEFAULT_CHARACTER_SET_NAME as charset, SUM(ROUND(((data_length + index_length) / 1024 / 1024), 2)) as size FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?", [$database]);

            return response()->json([
                'tables' => $tables,
                'info' => [
                    'charset' => $info[0]->charset ?? 'utf8mb4',
                    'size' => ($info[0]->size ?? 0) . ' MB'
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get table structure
     */
    public function getTableStructure($database, $table)
    {
        try {
            $columns = DB::select("SELECT COLUMN_NAME as name, COLUMN_TYPE as type, IS_NULLABLE as nullable, COLUMN_KEY as key, COLUMN_DEFAULT as default FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?", [$database, $table]);

            return response()->json([
                'columns' => $columns
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get table data with pagination
     */
    public function getTableData($database, $table, Request $request)
    {
        try {
            $limit = $request->input('limit', 10);
            $offset = $request->input('offset', 0);

            // Use the database connection to switch to the target database
            $columns = DB::select("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?", [$database, $table]);

            $data = DB::select("SELECT * FROM `$database`.`$table` LIMIT ? OFFSET ?", [$limit, $offset]);
            $total = DB::select("SELECT COUNT(*) as count FROM `$database`.`$table`")[0]->count;

            return response()->json([
                'data' => $data,
                'columns' => $columns,
                'total' => $total
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get Redis stats
     */
    public function getRedisStats()
    {
        try {
            $redis = \Redis::instance();
            $info = $redis->info();

            return response()->json([
                'status' => 'connected',
                'version' => $info['redis_version'] ?? 'unknown',
                'uptime' => $info['uptime_in_seconds'] ?? 0,
                'connectedClients' => $info['connected_clients'] ?? 0,
                'usedMemory' => $this->formatBytes($info['used_memory'] ?? 0),
                'maxMemory' => $this->formatBytes($info['maxmemory'] ?? 0),
                'keys' => $redis->dbSize(),
                'commandsPerSecond' => round(($info['instantaneous_ops_per_sec'] ?? 0), 2)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get system info
     */
    public function getSystemInfo()
    {
        try {
            $loadAvg = sys_getloadavg();
            $cpuUsage = $loadAvg[0] * 100; // Simplified CPU usage calculation

            // Memory usage
            $memoryUsage = 0;
            if (function_exists('shell_exec')) {
                $free = shell_exec('free | grep Mem');
                $values = preg_split('/\s+/', trim($free));
                if (count($values) >= 3) {
                    $memoryUsage = ($values[2] / $values[1]) * 100;
                }
            }

            // Disk usage
            $diskUsage = 0;
            if (function_exists('disk_free_space')) {
                $diskFree = disk_free_space('/');
                $diskTotal = disk_total_space('/');
                if ($diskTotal > 0) {
                    $diskUsage = (($diskTotal - $diskFree) / $diskTotal) * 100;
                }
            }

            $uptime = 0;
            if (function_exists('shell_exec')) {
                $uptimeStr = shell_exec('uptime -p');
                // Parse uptime output
            }

            return response()->json([
                'cpuUsage' => min($cpuUsage, 100),
                'memoryUsage' => min($memoryUsage, 100),
                'diskUsage' => min($diskUsage, 100),
                'uptime' => $uptime,
                'loadAverage' => $loadAvg,
                'processCount' => count(explode("\n", shell_exec('ps aux')))
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Optimize table
     */
    public function optimizeTable($database, $table)
    {
        try {
            DB::statement("OPTIMIZE TABLE `$database`.`$table`");
            return response()->json(['message' => 'Table optimized successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Repair table
     */
    public function repairTable($database, $table)
    {
        try {
            DB::statement("REPAIR TABLE `$database`.`$table`");
            return response()->json(['message' => 'Table repaired successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, 2) . ' ' . $units[$pow];
    }
}
