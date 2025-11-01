<?php

namespace App\Http\Controllers;

use App\Models\Ad;
use Illuminate\Http\Request;

class AdController extends Controller
{
    public function index()
    {
        return response()->json(Ad::all());
    }

    public function show($id)
    {
        $ad = Ad::findOrFail($id);
        return response()->json($ad);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'link' => 'required|string',
            'file_type' => 'required|in:image,pdf',
        ]);

        $ad = Ad::create($validated);
        return response()->json($ad, 201);
    }

    public function update(Request $request, $id)
    {
        $ad = Ad::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'link' => 'sometimes|string',
            'file_type' => 'sometimes|in:image,pdf',
        ]);
        $ad->update($validated);
        return response()->json($ad);
    }

    public function destroy($id)
    {
        $ad = Ad::findOrFail($id);
        $ad->delete();
        return response()->json(['message' => 'Ad deleted successfully']);
    }
}
