<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ModuleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $lang = $request->query('lang', 'en');
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userRoles = $user->roles->pluck('id')->toArray();
        if (empty($userRoles)) {
            return response()->json([]);
        }

        $modules = Module::whereHas('roles', function ($query) use ($userRoles) {
            $query->whereIn('roles.id', $userRoles);
        })->with(['navItems' => function ($query) use ($userRoles) {
            $query->whereHas('roles', function ($subQuery) use ($userRoles) {
                $subQuery->whereIn('roles.id', $userRoles);
            });
        }])->get()->map(function ($module) use ($lang) {
            $label = is_array($module->label) 
                ? $module->label 
                : (is_string($module->label) ? json_decode($module->label, true) : []);
            
            return [
                'id' => $module->id,
                'code' => $module->code,
                'label' => $label,
                'color' => $module->color,
                'icon' => $module->icon,
                'navItems' => $module->navItems->map(function ($item) use ($lang) {
                    $itemLabel = is_array($item->label) 
                        ? $item->label 
                        : (is_string($item->label) ? json_decode($item->label, true) : []);
                    
                    return [
                        'id' => $item->id,
                        'label' => $itemLabel,
                        'icon' => $item->icon,
                        'path' => $item->path,
                    ];
                })->toArray(),
                'created_at' => $module->created_at,
                'updated_at' => $module->updated_at,
            ];
        });

        return response()->json($modules);
    }

    public function show(Module $module): JsonResponse
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userRoles = $user->roles->pluck('id')->toArray();
        $hasAccess = $module->roles()->whereIn('roles.id', $userRoles)->exists();
        
        if (!$hasAccess) {
            return response()->json(['message' => 'Unauthorized. Module not accessible.'], 403);
        }

        return response()->json([
            'id' => $module->id,
            'code' => $module->code,
            'label' => $module->label ?? [],
            'color' => $module->color,
            'icon' => $module->icon,
            'navItems' => $module->navItems->toArray(),
            'created_at' => $module->created_at,
            'updated_at' => $module->updated_at,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:modules,code',
            'label' => 'required|array|min:1',
            'color' => 'nullable|string',
            'icon' => 'nullable|string',
            'roles' => 'nullable|array',
            'roles.*' => 'integer|exists:roles,id',
        ]);

        $roles = $validated['roles'] ?? null;
        unset($validated['roles']);

        $module = Module::create($validated);
        if (!empty($roles)) {
            $module->roles()->attach($roles);
        }

        return response()->json($module, 201);
    }

    public function update(Request $request, Module $module): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'sometimes|string|unique:modules,code,' . $module->id,
            'label' => 'sometimes|array|min:1',
            'color' => 'nullable|string',
            'icon' => 'nullable|string',
            'roles' => 'nullable|array',
            'roles.*' => 'integer|exists:roles,id',
        ]);

        $roles = $validated['roles'] ?? null;
        unset($validated['roles']);

        $module->update($validated);
        if ($roles !== null) {
            $module->roles()->sync($roles);
        }

        return response()->json($module);
    }

    public function destroy(Module $module): JsonResponse
    {
        $module->delete();
        return response()->json(['message' => 'Module deleted successfully'], 200);
    }
}
