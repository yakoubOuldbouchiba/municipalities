<?php


namespace App\Http\Controllers;


use App\Http\Controllers\Controller;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PersonController extends Controller
{
    // list persons by type (and optionally single resource)
    public function index(Request $request)
    {
        $type = $request->query('type'); // mayor / secretary_general / null => all
        $lang = $request->query('lang', 'en');

        $query = Person::query();
        if ($type) $query->where('type', $type);

        $persons = $query->orderBy('is_current', 'desc')->get()->map(function ($p) use ($lang) {
            return [
                'id' => $p->id,
                'type' => $p->type,
                'name' => $p->names[$lang] ?? $p->names['en'] ?? '',
                'message' => $p->messages[$lang] ?? $p->messages['en'] ?? null,
                'achievements' => $p->achievements[$lang] ?? $p->achievements['en'] ?? null,
                'image_url' => $p->image_url,
                'period' => $p->period,
                'is_current' => (bool) $p->is_current,
            ];
        });

        return response()->json($persons);
    }

    // show single person (by id)
    public function show(Request $request, Person $person)
    {
        $lang = $request->query('lang', 'en');

        return response()->json([
            'id' => $person->id,
            'type' => $person->type,
            'name' => $person->names[$lang] ?? $person->names['en'] ?? '',
            'message' => $person->messages[$lang] ?? $person->messages['en'] ?? null,
            'achievements' => $person->achievements[$lang] ?? $person->achievements['en'] ?? null,
            'image_url' => $person->image_url,
            'period' => $person->period,
            'is_current' => (bool) $person->is_current,
        ]);
    }

    // store new person
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', Rule::in(['mayor','secretary_general'])],
            'names' => 'required|array',
            'names.en' => 'required|string',
            'image_url' => 'nullable|url',
            'period' => 'nullable|string',
            'messages' => 'nullable|array',
            'achievements' => 'nullable|array',
            'is_current' => 'nullable|boolean',
        ]);

        // if is_current true, unset other current for same type
        if (!empty($data['is_current']) && $data['is_current']) {
            Person::where('type', $data['type'])->update(['is_current' => false]);
        }

        $person = Person::create($data);
        return response()->json($person, 201);
    }

    // update person
    public function update(Request $request, Person $person)
    {
        $data = $request->validate([
            'type' => [Rule::in(['mayor','secretary_general'])],
            'names' => 'nullable|array',
            'image_url' => 'nullable|url',
            'period' => 'nullable|string',
            'messages' => 'nullable|array',
            'achievements' => 'nullable|array',
            'is_current' => 'nullable|boolean',
        ]);

        if (isset($data['is_current']) && $data['is_current']) {
            Person::where('type', $person->type)->update(['is_current' => false]);
        }

        $person->update($data);
        return response()->json($person);
    }

    // delete person
    public function destroy(Person $person)
    {
        $person->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }
}
