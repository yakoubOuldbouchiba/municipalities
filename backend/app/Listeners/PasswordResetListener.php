<?php

namespace App\Listeners;

use App\Events\PassReset;
use App\Jobs\SendPasswordResetEmail;
use Mockery\Generator\StringManipulation\Pass\Pass;

class PasswordResetListener
{
    public function handle(Pass $event): void
    {
        // Dispatch email job to Redis queue
        SendPasswordResetEmail::dispatch($event->user)->onQueue('mails');
    }
}