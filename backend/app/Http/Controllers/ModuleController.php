<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ModuleController extends Controller
{
    /**
     * Get all modules with localization support and their nav items.
     */
    public function index(Request $request): JsonResponse
    {
        $lang = $request->query('lang', 'en');

        $modules = Module::with('navItems')->get()->map(function ($module) use ($lang) {
            // Ensure label is decoded as an array
            $label = is_array($module->label) ? $module->label : (is_string($module->label) ? json_decode($module->label, true) : []);
            
            return [
                'id' => $module->id,
                'code' => $module->code,
                'label' => $label[$lang] ?? $label['en'] ?? '',
                'color' => $module->color,
                'icon' => $module->icon,
                'navItems' => $module->navItems->map(function ($item) use ($lang) {
                    // Ensure nav item label is decoded as well
                    $itemLabel = is_array($item->label) ? $item->label : (is_string($item->label) ? json_decode($item->label, true) : []);
                    
                    return [
                        'id' => $item->id,
                        'label' => $itemLabel[$lang] ?? $itemLabel['en'] ?? '',
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

    /**
     * Get a single module with full localized object and nav items for editing.
     */
    public function show(Module $module): JsonResponse
    {
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

    /**
     * Create a new module.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:modules,code',
            'label' => 'required|array|min:1',
            'color' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        $module = Module::create($validated);
        return response()->json($module, 201);
    }

    /**
     * Update an existing module.
     */
    public function update(Request $request, Module $module): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'sometimes|string|unique:modules,code,' . $module->id,
            'label' => 'sometimes|array|min:1',
            'color' => 'nullable|string',
            'icon' => 'nullable|string',
        ]);

        $module->update($validated);
        return response()->json($module);
    }

    /**
     * Delete a module.
     */
    public function destroy(Module $module): JsonResponse
    {
        $module->delete();
        return response()->json(['message' => 'Module deleted successfully'], 200);
    }
}
