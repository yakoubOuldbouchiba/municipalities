<?php

namespace App\Listeners;

use App\Events\UserCreated;
use App\Jobs\SendWelcomeEmail;

class SendWelcomeEmailListener
{
    public function handle(UserCreated $event): void
    {
        // Direct job dispatch now handled in AuthController
        // This listener is kept for backward compatibility if needed
    }
}