<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    /**
     * Get all events with localization support.
     */
    public function index(Request $request): JsonResponse
    {
        $lang = $request->query('lang', 'en');
        $includeHidden = $request->query('include_hidden', false);
        
        $query = $includeHidden ? Event::withHidden() : Event::query();
        $events = $query->get()->map(function ($event) use ($lang) {
            return [
                'id' => $event->id,
                'status' => $event->status[$lang] ?? $event->status['en'] ?? '',
                'date' => $event->date,
                'description' => $event->description[$lang] ?? $event->description['en'] ?? '',
                'icon' => $event->icon,
                'color' => $event->color,
                'hidden' => $event->hidden,
            ];
        });

        return response()->json($events);
    }

    /**
     * Get a single event (returns full localized object for editing).
     */
    public function show($id): JsonResponse
    {
        $event = Event::withHidden()->findOrFail($id);
        return response()->json([
            'id' => $event->id,
            'status' => $event->status ?? [],
            'date' => $event->date,
            'description' => $event->description ?? [],
            'icon' => $event->icon,
            'color' => $event->color,
            'hidden' => $event->hidden,
        ]);
    }

    /**
     * Toggle event hidden status.
     */
    public function toggleHidden($id): JsonResponse
    {
        $event = Event::withHidden()->findOrFail($id);
        $event->update(['hidden' => !$event->hidden]);
        return response()->json([
            'message' => 'Event ' . ($event->hidden ? 'hidden' : 'shown') . ' successfully',
            'hidden' => $event->hidden
        ]);
    }

    /**
     * Create a new event.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|array|min:1',
            'date' => 'required|string',
            'description' => 'required|array|min:1',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $event = Event::create($validated);
        return response()->json($event, 201);
    }

    /**
     * Update an existing event.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $event = Event::withHidden()->findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|array|min:1',
            'date' => 'required|string',
            'description' => 'required|array|min:1',
            'icon' => 'nullable|string',
            'color' => 'nullable|string',
        ]);

        $event->update($validated);
        return response()->json($event);
    }

    /**
     * Delete an event.
     */
    public function destroy($id): JsonResponse
    {
        $event = Event::withHidden()->findOrFail($id);
        $event->delete();
        return response()->json(['message' => 'Event deleted successfully'], 200);
    }
}
