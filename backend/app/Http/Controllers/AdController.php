<?php

namespace App\Http\Controllers;

use App\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdController extends Controller
{
    /**
     * Get all ads with localization support.
     */
    public function index(Request $request): JsonResponse
    {
        $lang = $request->query('lang', 'en');
        $includeHidden = $request->query('include_hidden', false);

        $query = $includeHidden ? Ad::withHidden() : Ad::query();
        $ads = $query->get()->map(function ($ad) use ($lang) {
            return [
                'id' => $ad->id,
                'title' => $ad->title[$lang] ?? $ad->title['en'] ?? '',
                'description' => $ad->description[$lang] ?? $ad->description['en'] ?? '',
                'link' => $ad->link,
                'file_type' => $ad->file_type,
                'hidden' => $ad->hidden,
            ];
        });

        return response()->json($ads);
    }

    /**
     * Get a single ad (returns full localized object for editing).
     */
    public function show($id): JsonResponse
    {
        $ad = Ad::withHidden()->findOrFail($id);
        return response()->json([
            'id' => $ad->id,
            'title' => $ad->title ?? [],
            'description' => $ad->description ?? [],
            'link' => $ad->link,
            'file_type' => $ad->file_type,
            'hidden' => $ad->hidden,
        ]);
    }

    /**
     * Toggle ad hidden status.
     */
    public function toggleHidden($id): JsonResponse
    {
        $ad = Ad::withHidden()->findOrFail($id);
        $ad->update(['hidden' => !$ad->hidden]);
        return response()->json([
            'message' => 'Ad ' . ($ad->hidden ? 'hidden' : 'shown') . ' successfully',
            'hidden' => $ad->hidden
        ]);
    }

    /**
     * Create a new ad.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|array|min:1',
            'description' => 'nullable|array',
            'link' => 'required|string',
            'file_type' => 'required|in:image,pdf',
        ]);

        $ad = Ad::create($validated);
        return response()->json($ad, 201);
    }

    /**
     * Update an existing ad.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $ad = Ad::withHidden()->findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|array|min:1',
            'description' => 'nullable|array',
            'link' => 'sometimes|string',
            'file_type' => 'sometimes|in:image,pdf',
        ]);

        $ad->update($validated);
        return response()->json($ad);
    }

    /**
     * Delete an ad.
     */
    public function destroy($id): JsonResponse
    {
        $ad = Ad::withHidden()->findOrFail($id);
        $ad->delete();
        return response()->json(['message' => 'Ad deleted successfully'], 200);
    }

    /**
     * Upload a file (image or PDF) and return the link.
     */
    public function upload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:jpeg,png,gif,pdf|max:10240', // 10MB max
        ]);

        $file = $validated['file'];
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('ads', $fileName, 'public');

        return response()->json([
            'link' => asset('storage/' . $path),
        ], 201);
    }
}