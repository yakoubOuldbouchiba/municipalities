<?php

namespace App\Jobs;

use App\Mail\PasswordResetLink;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendPasswordResetEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $email,
        public string $resetToken,
        public string $resetUrl
    ) {
    }

    public function handle(): void
    {
        Mail::send(new PasswordResetLink(
            $this->email,
            $this->resetToken,
            $this->resetUrl
        ));
    }
}