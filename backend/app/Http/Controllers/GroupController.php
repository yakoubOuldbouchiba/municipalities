<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $lang = $request->query('lang', 'en');
        
        $groups = Group::with('roles')->get()->map(function ($group) use ($lang) {
            return [
                'id' => $group->id,
                'code' => $group->code,
                'label' => $group->label[$lang] ?? $group->label,
                'roles' => $group->roles->map(fn($role) => [
                    'id' => $role->id,
                    'code' => $role->code,
                    'label' => $this->getTranslatedLabel($role->label, $lang),
                ]),
                'created_at' => $group->created_at,
                'updated_at' => $group->updated_at,
            ];
        });

        return response()->json($groups);
    }
    
    /**
     * Get translated label from a label (string or array)
     */
    private function getTranslatedLabel($label, $lang)
    {
        if (is_array($label)) {
            return $label[$lang] ?? $label;
        }
        
        // Try to decode JSON string (may need double decoding)
        if (is_string($label) && str_starts_with($label, '{')) {
            $decoded = json_decode($label, true);
            if (is_array($decoded)) {
                return $decoded[$lang] ?? $label;
            }
            // If still a string, try decoding again
            if (is_string($decoded) && str_starts_with($decoded, '{')) {
                $doubleDecoded = json_decode($decoded, true);
                if (is_array($doubleDecoded)) {
                    return $doubleDecoded[$lang] ?? $label;
                }
            }
        }
        
        return $label;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:groups,code',
            'label' => 'required|array',
            'label.en' => 'required|string',
            'roles' => 'array',
            'roles.*' => 'integer|exists:roles,id',
        ]);

        $group = Group::create([
            'code' => $validated['code'],
            'label' => $validated['label'],
        ]);

        if (isset($validated['roles'])) {
            $group->roles()->attach($validated['roles']);
        }

        return response()->json($group->load('roles'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Group $group, Request $request)
    {
        $lang = $request->query('lang', 'en');
        
        return response()->json([
            'id' => $group->id,
            'code' => $group->code,
            'label' => $group->label,
            'label_' . $lang => $group->label[$lang] ?? null,
            'roles' => $group->roles->map(fn($role) => [
                'id' => $role->id,
                'code' => $role->code,
                'label' => $this->getTranslatedLabel($role->label, $lang),
            ]),
            'created_at' => $group->created_at,
            'updated_at' => $group->updated_at,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Group $group)
    {
        $validated = $request->validate([
            'code' => 'string|unique:groups,code,' . $group->id,
            'label' => 'array',
            'roles' => 'array',
            'roles.*' => 'integer|exists:roles,id',
        ]);

        $group->update([
            'code' => $validated['code'] ?? $group->code,
            'label' => $validated['label'] ?? $group->label,
        ]);

        if (isset($validated['roles'])) {
            $group->roles()->sync($validated['roles']);
        }

        return response()->json($group->load('roles'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        $group->delete();

        return response()->json(null, 204);
    }
}
