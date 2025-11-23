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

        $importantNumbers = ImportantNumber::all()->map(function ($num) use ($lang) {
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
            ];
        });

        return response()->json($importantNumbers);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'required|array',
            'label.en' => 'required|string',
            'value' => 'required|string',
        ]);

        $number = ImportantNumber::create($data);
        return response()->json($number, 201);
    }

    public function show($id)
    {
        $number = ImportantNumber::findOrFail($id);
        return response()->json($number);
    }

    public function update(Request $request, $id)
    {
        $number = ImportantNumber::findOrFail($id);

        $data = $request->validate([
            'label' => 'sometimes|array',
            'value' => 'sometimes|string',
        ]);

        $number->update($data);
        return response()->json($number);
    }

    public function destroy($id)
    {
        ImportantNumber::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
