<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;

class ClaimAnsweredMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $recipientName,
        public string $claimType,
        public string $answer,
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
            subject: __('mail.claim_answered.title'),
        );
    }

    public function content(): Content
    {
            // Ensure locale is set before rendering
        return new Content(
            view: 'emails.claim-answered',
            with: [
                'recipientName' => $this->recipientName,
                'claimType' => $this->claimType,
                'answer' => $this->answer,
                'language' => $this->language,
            ],
        );
    }
}
