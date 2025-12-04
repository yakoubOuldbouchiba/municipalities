<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // For API requests (JSON), return null to avoid redirect
        // The unauthenticated middleware will handle returning a 401 response
        return $request->expectsJson() ? null : null;
    }
}
