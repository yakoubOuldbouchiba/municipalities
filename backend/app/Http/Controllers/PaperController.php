<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Paper;

class PaperController extends Controller
{
    public function index(Request $request)
    {
        $lang = $request->get('lang', 'en');

        $papers = Paper::all()->map(function ($paper) use ($lang) {
            return [
                'id' => $paper->id,
                'slug' => $paper->slug,
                'title' => $paper->titles[$lang] ?? $paper->titles['en'],
                'description' => $paper->descriptions[$lang] ?? $paper->descriptions['en'],
            ];
        });

        return response()->json($papers);
    }

    public function show(string $slug)
    {
        $paper = Paper::where('slug', $slug)->first();

        if (!$paper) {
            return response()->json(['message' => 'Paper not found'], 404);
        }

        return response()->json($paper);
    }
}
