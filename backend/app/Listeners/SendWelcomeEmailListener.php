<?php

namespace App\Listeners;

use App\Events\UserCreated;
use App\Jobs\SendWelcomeEmail;

class SendWelcomeEmailListener
{
    public function handle(UserCreated $event): void
    {
        // Dispatch email job to Redis queue with default password and language
        SendWelcomeEmail::dispatch(
            $event->user,
            'password123',
            'en'
        )->onQueue('mails');
    }
}