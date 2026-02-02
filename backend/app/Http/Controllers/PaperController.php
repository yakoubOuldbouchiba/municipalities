<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Paper;
use Illuminate\Http\JsonResponse;

class PaperController extends Controller
{
    /**
     * Helper function to safely get localized value from array
     */
    private function getLocalizedValue($data, $lang, $default = '')
    {
        // Handle null
        if ($data === null) {
            return $default;
        }
        
        // If it's a string (JSON), decode it
        if (is_string($data)) {
            $data = json_decode($data, true);
        }
        
        // Check if it's now an array and not empty
        if (!is_array($data) || empty($data)) {
            return $default;
        }
        
        return $data[$lang] ?? $data['en'] ?? $default;
    }
    /**
     * Get all papers with localization support.
     */
    public function index(Request $request): JsonResponse
    {
        $lang = $request->get('lang', 'en');
        $includeHidden = $request->query('include_hidden', false);

        $query = $includeHidden ? Paper::withHidden() : Paper::query();
        $papers = $query->get()->map(function ($paper) use ($lang) {
            return [
                'id' => $paper->id,
                'slug' => $paper->slug,
                'title' => $this->getLocalizedValue($paper->titles, $lang, ''),
                'description' => $this->getLocalizedValue($paper->descriptions, $lang, ''),
                'hidden' => $paper->hidden,
            ];
        });

        return response()->json($papers);
    }

    /**
     * Get a single paper by ID (returns full localized object for editing).
     */
    public function showById(int $id): JsonResponse
    {
        $paper = Paper::find($id);

        if (!$paper) {
            return response()->json(['message' => 'Paper not found'], 404);
        }

        return response()->json([
            'id' => $paper->id,
            'slug' => $paper->slug,
            'title' => $paper->titles ?? [],
            'description' => $paper->descriptions ?? [],
        ]);
    }

    /**
     * Get a single paper by slug (returns full localized object for editing).
     */
    public function show(string $slug): JsonResponse
    {
        $paper = Paper::where('slug', $slug)->first();

        if (!$paper) {
            return response()->json(['message' => 'Paper not found'], 404);
        }

        return response()->json([
            'id' => $paper->id,
            'slug' => $paper->slug,
            'title' => $paper->titles ?? [],
            'description' => $paper->descriptions ?? [],
        ]);
    }

    /**
     * Create a new paper.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:papers,slug',
            'title' => 'required|array|min:1',
            'description' => 'required|array|min:1',
        ]);

        $paper = Paper::create([
            'slug' => $validated['slug'],
            'titles' => $validated['title'],
            'descriptions' => $validated['description'],
        ]);
        return response()->json($paper, 201);
    }

    /**
     * Update an existing paper.
     */
    public function update(Request $request, Paper $paper): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'sometimes|string|unique:papers,slug,' . $paper->id,
            'title' => 'sometimes|array|min:1',
            'description' => 'sometimes|array|min:1',
        ]);

        $data = [];
        if (isset($validated['slug'])) {
            $data['slug'] = $validated['slug'];
        }
        if (isset($validated['title'])) {
            $data['titles'] = $validated['title'];
        }
        if (isset($validated['description'])) {
            $data['descriptions'] = $validated['description'];
        }

        $paper->update($data);
        return response()->json($paper);
    }

    /**
     * Delete a paper.
     */
    public function destroy(Paper $paper): JsonResponse
    {
        $paper->delete();
        return response()->json(['message' => 'Paper deleted successfully'], 200);
    }

    /**
     * Toggle paper hidden status.
     */
    public function toggleHidden($id): JsonResponse
    {
        $paper = Paper::withHidden()->findOrFail($id);
        $paper->update(['hidden' => !$paper->hidden]);
        return response()->json([
            'message' => 'Paper ' . ($paper->hidden ? 'hidden' : 'shown') . ' successfully',
            'hidden' => $paper->hidden
        ]);
    }
}
