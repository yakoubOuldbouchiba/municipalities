<?php

namespace App\Console\Commands;

use App\Models\CitizenClaim;
use App\Models\CompanyClaim;
use App\Models\OrganizationClaim;
use Illuminate\Console\Command;

class CleanupOldClaims extends Command
{
    protected $signature = 'claims:cleanup';
    protected $description = 'Archive claims older than 3 months and purge answered claims older than 1 month';

    public function handle(): int
    {
        $this->info('Starting cleanup of old claims...');

        // Archive claims older than 3 months
        $this->info('Archiving claims older than 3 months...');
        $citizenArchived = CitizenClaim::olderThan(3)->update(['status' => 'archived']);
        $companyArchived = CompanyClaim::olderThan(3)->update(['status' => 'archived']);
        $organizationArchived = OrganizationClaim::olderThan(3)->update(['status' => 'archived']);

        $this->info("Archived - Citizen: $citizenArchived, Company: $companyArchived, Organization: $organizationArchived");

        // Purge answered claims older than 1 month
        $this->info('Purging answered claims older than 1 month...');
        $citizenPurged = CitizenClaim::where('status', 'answered')
            ->where('answered_at', '<=', now()->subMonths(1))
            ->forceDelete();
        
        $companyPurged = CompanyClaim::where('status', 'answered')
            ->where('answered_at', '<=', now()->subMonths(1))
            ->forceDelete();
        
        $organizationPurged = OrganizationClaim::where('status', 'answered')
            ->where('answered_at', '<=', now()->subMonths(1))
            ->forceDelete();

        $this->info("Purged - Citizen: $citizenPurged, Company: $companyPurged, Organization: $organizationPurged");

        $this->info('Cleanup completed successfully!');
        return 0;
    }
}
