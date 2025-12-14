<?php

namespace App\Listeners;

use App\Events\UserCreated;
use App\Jobs\SendWelcomeEmail;

class SendWelcomeEmailListener
{
    public function handle(UserCreated $event): void
    {
        // Dispatch email job to Redis queue
        SendWelcomeEmail::dispatch($event->user)->onQueue('mails');
    }
}