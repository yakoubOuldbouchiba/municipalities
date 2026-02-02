<?php

namespace App\Http\Controllers;

use App\Models\Potential;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PotentialController extends Controller
{
    /**
     * Get all potentials with localization support.
     */
    public function index(Request $request): JsonResponse
    {
        $lang = $request->query('lang', 'en');
        $includeHidden = $request->query('include_hidden', false);

        $query = $includeHidden ? Potential::withHidden() : Potential::query();
        $potentials = $query->get()->map(function ($p) use ($lang) {
            return [
                'id' => $p->id,
                'slug' => $p->slug,
                'title' => $p->title[$lang] ?? $p->title['en'] ?? '',
                'description' => $p->description[$lang] ?? $p->description['en'] ?? '',
                'hidden' => $p->hidden,
            ];
        });

        return response()->json($potentials);
    }

    /**
     * Get a single potential by ID (returns full localized object for editing).
     */
    public function show($id): JsonResponse
    {
        $potential = Potential::withHidden()->findOrFail($id);
        return response()->json([
            'id' => $potential->id,
            'slug' => $potential->slug,
            'title' => $potential->title ?? [],
            'description' => $potential->description ?? [],
            'hidden' => $potential->hidden,
        ]);
    }

    /**
     * Toggle potential hidden status.
     */
    public function toggleHidden($id): JsonResponse
    {
        $potential = Potential::withHidden()->findOrFail($id);
        $potential->update(['hidden' => !$potential->hidden]);
        return response()->json([
            'message' => 'Potential ' . ($potential->hidden ? 'hidden' : 'shown') . ' successfully',
            'hidden' => $potential->hidden
        ]);
    }

    /**
     * Create a new potential.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:potentials,slug',
            'title' => 'required|array|min:1',
            'description' => 'required|array|min:1',
        ]);

        $potential = Potential::create($validated);

        return response()->json($potential, 201);
    }

    /**
     * Update an existing potential.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $potential = Potential::withHidden()->findOrFail($id);
        $validated = $request->validate([
            'slug' => 'required|string|unique:potentials,slug,' . $potential->id,
            'title' => 'required|array|min:1',
            'description' => 'required|array|min:1',
        ]);

        $potential->update($validated);

        return response()->json($potential);
    }

    /**
     * Delete a potential.
     */
    public function destroy($id): JsonResponse
    {
        $potential = Potential::withHidden()->findOrFail($id);
        $potential->delete();

        return response()->json(['message' => 'Potential deleted successfully'], 200);
    }

}
