<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckApiRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Check if user has any of the required roles
        $userRoleCodes = $user->roles()->pluck('code')->toArray();

        // Check for super admin or if user has any of the required roles
        $hasSuperAdminRole = in_array('API:superadmin', $userRoleCodes);
        $hasRequiredRole = false;

        foreach ($roles as $role) {
            if (in_array($role, $userRoleCodes)) {
                $hasRequiredRole = true;
                break;
            }
        }

        if (!$hasSuperAdminRole && !$hasRequiredRole) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'You do not have permission to access this resource',
                'required_roles' => $roles,
            ], 403);
        }

        return $next($request);
    }
}
