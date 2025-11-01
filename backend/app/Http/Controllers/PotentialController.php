<?php

namespace App\Http\Controllers;

use App\Models\Potential;
use Illuminate\Http\Request;

class PotentialController extends Controller
{
    public function index(Request $request)
    {
        $lang = $request->query('lang', 'en');

        $potentials = Potential::all()->map(function ($p) use ($lang) {
            return [
                'id' => $p->id,
                'slug' => $p->slug,
                'title' => $p->title[$lang] ?? $p->title['en'],
                'description' => $p->description[$lang] ?? $p->description['en'],
            ];
        });

        return response()->json($potentials);
    }
}
