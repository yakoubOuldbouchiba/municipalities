<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $lang = $request->query('lang', 'en'); // ?lang=en
        $events = Event::all()->map(function ($event) use ($lang) {
            $desc = $event->description[$lang] ?? $event->description['en'] ?? '';
            return [
                'id' => $event->id,
                'status' => $event->status,
                'date' => $event->date,
                'description' => $desc,
                'icon' => $event->icon,
                'color' => $event->color,
            ];
        });
        return response()->json($events);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'date' => 'required|string',
            'description' => 'required|array',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $event = Event::create($validated);
        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        return response()->json($event);
    }

    public function update(Request $request, Event $event)
    {
        $event->update($request->all());
        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
