<?php

namespace App\Http\Controllers;

use App\Models\NavItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NavItemController extends Controller
{
    /**
     * Get all nav items for a module with role-based filtering.
     */
    public function indexByModule(Request $request, int $moduleId): JsonResponse
    {
        $lang = $request->query('lang', 'en');
        
        // Get authenticated user's roles
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userRoles = $user->roles->pluck('id')->toArray();
        
        // If user has no roles, return empty array
        if (empty($userRoles)) {
            return response()->json([]);
        }

        // Get nav items filtered by user's roles
        $navItems = NavItem::where('module_id', $moduleId)
            ->whereHas('roles', function ($query) use ($userRoles) {
                $query->whereIn('roles.id', $userRoles);
            })
            ->get()
            ->map(function ($item) use ($lang) {
                $itemLabel = is_array($item->label) 
                    ? $item->label 
                    : (is_string($item->label) ? json_decode($item->label, true) : []);
                
                return [
                    'id' => $item->id,
                    'module_id' => $item->module_id,
                    'label' => $itemLabel,
                    'icon' => $item->icon,
                    'path' => $item->path,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ];
            });

        return response()->json($navItems);
    }

    /**
     * Get a single nav item with role-based authorization check.
     */
    public function show(NavItem $navItem): JsonResponse
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userRoles = $user->roles->pluck('id')->toArray();
        
        // Check if user has access to this nav item
        $hasAccess = $navItem->roles()
            ->whereIn('roles.id', $userRoles)
            ->exists();
        
        if (!$hasAccess) {
            return response()->json([
                'message' => 'Unauthorized. Nav item not accessible.',
            ], 403);
        }

        return response()->json([
            'id' => $navItem->id,
            'module_id' => $navItem->module_id,
            'label' => $navItem->label ?? [],
            'icon' => $navItem->icon,
            'path' => $navItem->path,
            'created_at' => $navItem->created_at,
            'updated_at' => $navItem->updated_at,
        ]);
    }

    /**
     * Create a new nav item.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'module_id' => 'required|exists:modules,id',
            'label' => 'required|array|min:1',
            'icon' => 'required|string',
            'path' => 'required|string',
            'roles' => 'nullable|array',
            'roles.*' => 'integer|exists:roles,id',
        ]);

        $roles = $validated['roles'] ?? null;
        unset($validated['roles']);

        $navItem = NavItem::create($validated);
        
        if (!empty($roles)) {
            $navItem->roles()->attach($roles);
        }

        return response()->json($navItem, 201);
    }

    /**
     * Update an existing nav item.
     */
    public function update(Request $request, NavItem $navItem): JsonResponse
    {
        $validated = $request->validate([
            'module_id' => 'sometimes|exists:modules,id',
            'label' => 'sometimes|array|min:1',
            'icon' => 'sometimes|string',
            'path' => 'sometimes|string',
            'roles' => 'nullable|array',
            'roles.*' => 'integer|exists:roles,id',
        ]);

        $roles = $validated['roles'] ?? null;
        unset($validated['roles']);

        $navItem->update($validated);
        
        if ($roles !== null) {
            $navItem->roles()->sync($roles);
        }

        return response()->json($navItem);
    }

    /**
     * Delete a nav item.
     */
    public function destroy(NavItem $navItem): JsonResponse
    {
        $navItem->delete();
        return response()->json(['message' => 'Nav item deleted successfully'], 200);
    }
}
