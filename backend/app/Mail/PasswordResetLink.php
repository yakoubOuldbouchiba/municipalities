<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetLink extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $email,
        public string $resetToken,
        public string $resetUrl
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.from.address'), config('mail.from.name')),
            to: $this->email,
            subject: 'Reset Your Baladia Password',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.password-reset',
            with: [
                'email' => $this->email,
                'resetUrl' => $this->resetUrl,
                'resetToken' => $this->resetToken,
            ],
        );
    }
}