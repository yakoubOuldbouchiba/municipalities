<?php

namespace App\Jobs;

use App\Mail\ClaimAnsweredMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendClaimAnsweredEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $email,
        public string $recipientName,
        public string $claimType,
        public string $answer,
        public string $language = 'en'
    ) {
        $this->onQueue('mail_queue');
    }

    public function handle(): void
    {
        Mail::to($this->email)->send(
            new ClaimAnsweredMail(
                $this->recipientName,
                $this->claimType,
                $this->answer,
                $this->language
            )
        );
    }
}

