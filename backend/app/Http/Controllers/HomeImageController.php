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
        $images = HomeImage::all()->map(function ($image) use ($lang) {
            return [
                'id' => $image->id,
                'url' => $image->url,
                'caption' => $image->captions[$lang] ?? $image->captions['en'],
            ];
        });

        return response()->json($images);

    }
    public function show(HomeImage $image): JsonResponse
    {
        return response()->json([
            'id' => $image->id,
            'url' => $image->url,
            'caption' => $image->captions ?? [],
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
    public function update(Request $request, HomeImage $image): JsonResponse
    {
        $validated = $request->validate([
            'url' => 'sometimes|required|string',
            'captions' => 'sometimes|required|array|min:1',
        ]);

        $image->update($validated);

        return response()->json($image);
    }
    public function destroy(HomeImage $image): JsonResponse
    {
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
