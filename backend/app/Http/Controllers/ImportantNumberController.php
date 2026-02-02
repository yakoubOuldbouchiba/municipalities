<?php

namespace App\Http\Controllers;

use App\Models\ImportantNumber;
use Illuminate\Http\Request;

class ImportantNumberController extends Controller
{
    public function index(Request $request)
    {
        // Get the language from query param, default to 'en'
        $lang = $request->get('lang', 'en');
        $includeHidden = $request->query('include_hidden', false);

        $query = $includeHidden ? ImportantNumber::withHidden() : ImportantNumber::query();
        $importantNumbers = $query->get()->map(function ($num) use ($lang) {
            // label may be stored as JSON string (from DB seeder) or already cast to array by Eloquent
            if (is_string($num->label)) {
                $labels = json_decode($num->label, true) ?? [];
            } elseif (is_array($num->label)) {
                $labels = $num->label;
            } else {
                $labels = [];
            }

            return [
                'id' => $num->id,
                'label' => $labels[$lang] ?? $labels['en'] ?? '',
                'value' => $num->value,
                'hidden' => $num->hidden,
            ];
        });

        return response()->json($importantNumbers);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'required|array',
            'value' => 'required|string',
        ]);

        $number = ImportantNumber::create($data);
        return response()->json($number, 201);
    }

    public function show($id)
    {
        $number = ImportantNumber::withHidden()->findOrFail($id);
        return response()->json($number);
    }

    /**
     * Toggle number hidden status.
     */
    public function toggleHidden($id)
    {
        $number = ImportantNumber::withHidden()->findOrFail($id);
        $number->update(['hidden' => !$number->hidden]);
        return response()->json([
            'message' => 'Number ' . ($number->hidden ? 'hidden' : 'shown') . ' successfully',
            'hidden' => $number->hidden
        ]);
    }

    public function update(Request $request, $id)
    {
        $number = ImportantNumber::withHidden()->findOrFail($id);

        $data = $request->validate([
            'label' => 'sometimes|array',
            'value' => 'sometimes|string',
        ]);

        $number->update($data);
        return response()->json($number);
    }

    public function destroy($id)
    {
        $number = ImportantNumber::withHidden()->findOrFail($id);
        $number->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
