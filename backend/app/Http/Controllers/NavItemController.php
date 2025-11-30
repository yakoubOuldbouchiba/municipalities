<?php

namespace App\Http\Controllers;

use App\Models\NavItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NavItemController extends Controller
{
    /**
     * Get all nav items for a module with localization support.
     */
    public function indexByModule(Request $request, int $moduleId): JsonResponse
    {
        $lang = $request->query('lang', 'en');

        $navItems = NavItem::where('module_id', $moduleId)->get()->map(function ($item) use ($lang) {
            return [
                'id' => $item->id,
                'module_id' => $item->module_id,
                'label' => $item->label[$lang] ?? $item->label['en'] ?? '',
                'icon' => $item->icon,
                'path' => $item->path,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });

        return response()->json($navItems);
    }

    /**
     * Get a single nav item (returns full localized object for editing).
     */
    public function show(NavItem $navItem): JsonResponse
    {
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
        ]);

        $navItem = NavItem::create($validated);
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
        ]);

        $navItem->update($validated);
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
