<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CitizenClaim;
use App\Models\CompanyClaim;
use App\Models\OrganizationClaim;
use Illuminate\Support\Facades\Storage;

class DeleteOldClaimFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'claims:delete-old-files {--days=30 : Number of days after answer to delete files}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete physical files from claims answered more than X days ago';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = (int)$this->option('days');
        $cutoffDate = now()->subDays($days);

        $this->info("Deleting files from claims answered before: {$cutoffDate}");

        // Delete files from CitizenClaims
        $this->deleteFilesFromModel(CitizenClaim::class, $cutoffDate);

        // Delete files from CompanyClaims
        $this->deleteFilesFromModel(CompanyClaim::class, $cutoffDate);

        // Delete files from OrganizationClaims
        $this->deleteFilesFromModel(OrganizationClaim::class, $cutoffDate);

        $this->info('Old claim files deleted successfully');
    }

    /**
     * Delete files for a specific claim model
     */
    private function deleteFilesFromModel($modelClass, $cutoffDate)
    {
        $claims = $modelClass::where('status', 'answered')
            ->whereNotNull('answered_at')
            ->where('answered_at', '<=', $cutoffDate)
            ->whereNotNull('files')
            ->get();

        foreach ($claims as $claim) {
            if (is_array($claim->files) && !empty($claim->files)) {
                foreach ($claim->files as $file) {
                    if (is_string($file)) {
                        // If file is a path, delete it
                        if (Storage::disk('public')->exists($file)) {
                            Storage::disk('public')->delete($file);
                            $this->info("Deleted file: {$file}");
                        }
                    } elseif (is_array($file) && isset($file['path'])) {
                        // If file is an array with 'path' key
                        if (Storage::disk('public')->exists($file['path'])) {
                            Storage::disk('public')->delete($file['path']);
                            $this->info("Deleted file: {$file['path']}");
                        }
                    }
                }

                // Clear the files field after deletion
                $claim->update(['files' => null]);
            }
        }

        $this->info("Processed " . $claims->count() . " " . class_basename($modelClass) . " claims");
    }
}
