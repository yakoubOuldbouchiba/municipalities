<?php

namespace App\Http\Controllers;

use App\Models\HomeImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HomeImageController extends Controller
{
    public function index(Request $request)
    {
        $lang = $request->get('lang', 'en');
        $includeHidden = $request->query('include_hidden', false);
        
        $query = $includeHidden ? HomeImage::withHidden() : HomeImage::query();
        $images = $query->get()->map(function ($image) use ($lang) {
            return [
                'id' => $image->id,
                'url' => $image->url,
                'caption' => $image->captions[$lang] ?? $image->captions['en'],
                'hidden' => $image->hidden,
            ];
        });

        return response()->json($images);

    }
    public function show($id): JsonResponse
    {
        $image = HomeImage::withHidden()->findOrFail($id);
        return response()->json([
            'id' => $image->id,
            'url' => $image->url,
            'caption' => $image->captions ?? [],
            'hidden' => $image->hidden,
        ]);
    }

    /**
     * Toggle image hidden status.
     */
    public function toggleHidden($id): JsonResponse
    {
        $image = HomeImage::withHidden()->findOrFail($id);
        $image->update(['hidden' => !$image->hidden]);
        return response()->json([
            'message' => 'Image ' . ($image->hidden ? 'hidden' : 'shown') . ' successfully',
            'hidden' => $image->hidden
        ]);
    }
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'url' => 'required|string',
            'captions' => 'required|array|min:1',
        ]);

        $image = HomeImage::create($validated);

        return response()->json($image, 201);
    }
    public function update(Request $request, $id): JsonResponse
    {
        $image = HomeImage::withHidden()->findOrFail($id);
        $validated = $request->validate([
            'url' => 'sometimes|required|string',
            'captions' => 'sometimes|required|array|min:1',
        ]);

        $image->update($validated);

        return response()->json($image);
    }
    public function destroy($id): JsonResponse
    {
        $image = HomeImage::withHidden()->findOrFail($id);
        $image->delete();

        return response()->json(null, 204);
    }

    /**
     * upload image for home image
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => 'required|image|max:25120', // max 25MB
        ]);
        $image = $validated['image'];
        $fileName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
        $path = $image->storeAs('home_images', $fileName, 'public');

        return response()->json([
            'link' => asset('storage/' . $path),
        ], 201);
    }


}
