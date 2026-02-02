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
        $includeHidden = $request->query('include_hidden', false);

        // Fetch and map links with translated labels
        $query = $includeHidden ? QuickLink::withHidden() : QuickLink::query();
        $quickLinks = $query->get()->map(function ($link) use ($lang) {
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
                'hidden' => $link->hidden,
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
        $link = QuickLink::withHidden()->findOrFail($id);
        return response()->json($link);
    }

    /**
     * Toggle link hidden status.
     */
    public function toggleHidden($id)
    {
        $link = QuickLink::withHidden()->findOrFail($id);
        $link->update(['hidden' => !$link->hidden]);
        return response()->json([
            'message' => 'Link ' . ($link->hidden ? 'hidden' : 'shown') . ' successfully',
            'hidden' => $link->hidden
        ]);
    }

    public function update(Request $request, $id)
    {
        $link = QuickLink::withHidden()->findOrFail($id);

        $data = $request->validate([
            'label' => 'sometimes|array',
            'url' => 'sometimes|string',
        ]);

        $link->update($data);
        return response()->json($link);
    }

    public function destroy($id)
    {
        $link = QuickLink::withHidden()->findOrFail($id);
        $link->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
