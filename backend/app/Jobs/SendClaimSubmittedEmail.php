<?php

namespace App\Jobs;

use App\Mail\ClaimSubmittedMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendClaimSubmittedEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $email,
        public string $recipientName,
        public string $claimType,
        public string $claimContent,
        public string $language = 'en'
    ) {
        $this->onQueue('mail_queue');
    }

    public function handle(): void
    {
        Mail::send(
            new ClaimSubmittedMail(
                $this->email,
                $this->recipientName,
                $this->claimType,
                $this->claimContent,
                $this->language
            )
        );
    }
}

