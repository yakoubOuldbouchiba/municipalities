<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;

class PasswordResetLink extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $email,
        public string $resetToken,
        public string $resetUrl,
        public string $language = 'en'
    ) {
        // Set locale immediately in constructor so it persists
        App::setLocale($this->language);
    }

    public function envelope(): Envelope
    {
        // Ensure locale is set before rendering
        App::setLocale($this->language);

        return new Envelope(
            from: new Address(config('mail.from.address'), config('mail.from.name')),
            to: $this->email,
            subject: __('mail.password_reset.title'),
        );
    }

    public function content(): Content
    {
            // Ensure locale is set before rendering
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