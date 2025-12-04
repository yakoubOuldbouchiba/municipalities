<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    /**
     * Get all roles with localization support.
     */
    public function index(Request $request): JsonResponse
    {
        $lang = $request->query('lang', 'en');

        $roles = Role::all()->map(function ($role) use ($lang) {
            // Ensure label is decoded as an array
            $label = is_array($role->label) ? $role->label : (is_string($role->label) ? json_decode($role->label, true) : []);
            
            return [
                'id' => $role->id,
                'code' => $role->code,
                'label' => $label[$lang] ?? $label['en'] ?? '',
                'created_at' => $role->created_at,
                'updated_at' => $role->updated_at,
            ];
        });

        return response()->json($roles);
    }

    /**
     * Get a single role with full localized object for editing.
     */
    public function show(Role $role): JsonResponse
    {
        return response()->json([
            'id' => $role->id,
            'code' => $role->code,
            'label' => $role->label ?? [],
            'created_at' => $role->created_at,
            'updated_at' => $role->updated_at,
        ]);
    }

    /**
     * Create a new role.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:roles,code',
            'label' => 'required|array|min:1',
        ]);

        // Validate that code starts with NAV:, MODULE:, or ACTION:
        if (!preg_match('/^(NAV:|MODULE:|ACTION:)/', $validated['code'])) {
            return response()->json([
                'message' => 'Code must start with NAV:, MODULE:, or ACTION:'
            ], 422);
        }

        $role = Role::create($validated);
        return response()->json($role, 201);
    }

    /**
     * Update an existing role.
     */
    public function update(Request $request, Role $role): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'sometimes|string|unique:roles,code,' . $role->id,
            'label' => 'sometimes|array|min:1',
        ]);

        // Validate that code starts with NAV:, MODULE:, or ACTION: if being updated
        if (isset($validated['code']) && !preg_match('/^(NAV:|MODULE:|ACTION:)/', $validated['code'])) {
            return response()->json([
                'message' => 'Code must start with NAV:, MODULE:, or ACTION:'
            ], 422);
        }

        $role->update($validated);
        return response()->json($role);
    }

    /**
     * Delete a role.
     */
    public function destroy(Role $role): JsonResponse
    {
        $role->delete();
        return response()->json(['message' => 'Role deleted successfully'], 200);
    }
}
