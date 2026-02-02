<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NewsController extends Controller
{
    /**
     * Get all news with localization support.
     */
    public function index(Request $request): JsonResponse
    {
        $lang = $request->query('lang', 'en');
        $includeHidden = $request->query('include_hidden', false);

        $query = $includeHidden ? News::withHidden() : News::query();
        $news = $query->get()->map(function ($item) use ($lang) {
            return [
                'id' => $item->id,
                'title' => $item->title[$lang] ?? $item->title['en'] ?? '',
                'description' => $item->description[$lang] ?? $item->description['en'] ?? '',
                'fileUrl' => $item->fileUrl,
                'hidden' => $item->hidden,
            ];
        });

        return response()->json($news);
    }

    /**
     * Get a single news item (returns full localized object for editing).
     */
    public function show($id): JsonResponse
    {
        $news = News::withHidden()->findOrFail($id);
        return response()->json([
            'id' => $news->id,
            'title' => $news->title ?? [],
            'description' => $news->description ?? [],
            'fileUrl' => $news->fileUrl,
            'hidden' => $news->hidden,
        ]);
    }

    /**
     * Toggle news hidden status.
     */
    public function toggleHidden($id): JsonResponse
    {
        $news = News::withHidden()->findOrFail($id);
        $news->update(['hidden' => !$news->hidden]);
        return response()->json([
            'message' => 'News ' . ($news->hidden ? 'hidden' : 'shown') . ' successfully',
            'hidden' => $news->hidden
        ]);
    }

    /**
     * Create a new news item.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|array|min:1',
            'description' => 'required|array|min:1',
            'fileUrl' => 'required|string',
        ]);

        $news = News::create($validated);
        return response()->json($news, 201);
    }

    /**
     * Update an existing news item.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $news = News::withHidden()->findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|array|min:1',
            'description' => 'sometimes|array|min:1',
            'fileUrl' => 'sometimes|string',
        ]);

        $news->update($validated);
        return response()->json($news);
    }

    /**
     * Delete a news item.
     */
    public function destroy($id): JsonResponse
    {
        $news = News::withHidden()->findOrFail($id);
        $news->delete();
        return response()->json(['message' => 'News item deleted successfully'], 200);
    }

    /**
     * Upload a file (image) and return the link.
     */
    public function upload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:jpeg,png,gif|max:10240', // 10MB max
        ]);

        $file = $validated['file'];
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('news', $fileName, 'public');

        return response()->json([
            'fileUrl' => asset('storage/' . $path),
        ], 201);
    }
}
