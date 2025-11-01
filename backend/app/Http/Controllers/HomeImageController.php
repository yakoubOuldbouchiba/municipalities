<?php

namespace App\Http\Controllers;

use App\Models\HomeImage;
use Illuminate\Http\Request;

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
}
