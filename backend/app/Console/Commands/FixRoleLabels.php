<?php

namespace App\Console\Commands;

use App\Models\Role;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixRoleLabels extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fix-role-labels';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix double-encoded JSON labels in roles table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $roles = Role::all();
        $fixed = 0;
        
        foreach ($roles as $role) {
            $label = $role->getRawOriginal('label');
            
            // Check if it's a string that looks like JSON
            if (is_string($label)) {
                // Try to decode
                $decoded = json_decode($label, true);
                
                // If it's still a string, it was double-encoded
                if (is_string($decoded) && (str_starts_with($decoded, '{') || str_starts_with($decoded, '['))) {
                    $doubleDecoded = json_decode($decoded, true);
                    if (is_array($doubleDecoded)) {
                        // Update with properly decoded version
                        DB::table('roles')->where('id', $role->id)->update(['label' => json_encode($doubleDecoded)]);
                        $this->line("Fixed role {$role->id}: {$role->code}");
                        $fixed++;
                    }
                }
            }
        }
        
        $this->info("Fixed $fixed role labels");
    }
}
