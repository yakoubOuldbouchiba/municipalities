<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QuickLink;

class QuickLinkController extends Controller
{
    public function index(Request $request)
    {
        // Get selected language (default: English)
        $lang = $request->get('lang', 'en');

        // Fetch and map links with translated labels
        $quickLinks = QuickLink::all()->map(function ($link) use ($lang) {
            // `label` may be stored as JSON string or already cast to array by the model.
            if (is_string($link->label)) {
                $labels = json_decode($link->label, true) ?? [];
            } elseif (is_array($link->label)) {
                $labels = $link->label;
            } else {
                $labels = [];
            }

            return [
                'id' => $link->id,
                'label' => $labels[$lang] ?? $labels['en'] ?? '',
                'url' => $link->url,
            ];
        });

        return response()->json($quickLinks);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'required|array',
            'label.en' => 'required|string',
            'url' => 'required|string',
        ]);

        $quickLink = QuickLink::create($data);
        return response()->json($quickLink, 201);
    }

    public function show($id)
    {
        $link = QuickLink::findOrFail($id);
        return response()->json($link);
    }

    public function update(Request $request, $id)
    {
        $link = QuickLink::findOrFail($id);

        $data = $request->validate([
            'label' => 'sometimes|array',
            'url' => 'sometimes|string',
        ]);

        $link->update($data);
        return response()->json($link);
    }

    public function destroy($id)
    {
        QuickLink::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
