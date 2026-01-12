<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;

class WelcomeNewUser extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $password,
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
            to: $this->user->email,
            subject: __('mail.welcome.title'),
        );
    }

    public function content(): Content
    {
            // Ensure locale is set before rendering
        return new Content(
            view: 'mail.welcome',
            with: [
                'user' => $this->user,
                'password' => $this->password,
            ],
        );
    }
}