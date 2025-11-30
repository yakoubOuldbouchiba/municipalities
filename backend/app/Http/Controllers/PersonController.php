<?php


namespace App\Http\Controllers;


use App\Http\Controllers\Controller;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PersonController extends Controller
{
    /**
     * Helper function to safely get localized value from array
     */
    private function getLocalizedValue($data, $lang, $default = null)
    {
        // Handle null
        if ($data === null) {
            return $default;
        }
        
        // If it's a string (JSON), decode it
        if (is_string($data)) {
            $data = json_decode($data, true);
        }
        
        // Check if it's now an array and not empty
        if (!is_array($data) || empty($data)) {
            return $default;
        }
        
        return $data[$lang] ?? $data['en'] ?? $default;
    }

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
                'name' => $this->getLocalizedValue($p->names, $lang, ''),
                'message' => $this->getLocalizedValue($p->messages, $lang, null),
                'achievements' => $this->getLocalizedValue($p->achievements, $lang, null),
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
        $full = $request->query('full', false); // full=true returns all multilingual data for editing

        if ($full) {
            // Return full multilingual object for editing - only non-empty values
            $names = is_string($person->names) ? json_decode($person->names, true) : ($person->names ?? []);
            $messages = is_string($person->messages) ? json_decode($person->messages, true) : ($person->messages ?? []);
            $achievements = is_string($person->achievements) ? json_decode($person->achievements, true) : ($person->achievements ?? []);
            
            // Filter out empty/null values
            $names = array_filter($names, fn($v) => !empty($v));
            $messages = array_filter($messages, fn($v) => !empty($v));
            $achievements = array_filter($achievements, fn($v) => !empty($v));
            
            // Get all languages: combine those with data + configured system languages
            $configuredLangs = ['en', 'ar', 'fr', 'es']; // Configured languages in the app
            $dataLangs = array_keys(array_merge($names, $messages, $achievements));
            $allLanguages = array_unique(array_merge($configuredLangs, $dataLangs));
            sort($allLanguages); // Sort for consistency
            
            // Initialize each field with all languages, preserving existing data
            $namesComplete = [];
            $messagesComplete = [];
            $achievementsComplete = [];
            
            foreach ($allLanguages as $lng) {
                $namesComplete[$lng] = $names[$lng] ?? '';
                $messagesComplete[$lng] = $messages[$lng] ?? '';
                $achievementsComplete[$lng] = $achievements[$lng] ?? '';
            }
            
            return response()->json([
                'id' => $person->id,
                'type' => $person->type,
                'names' => $namesComplete,
                'messages' => $messagesComplete,
                'achievements' => $achievementsComplete,
                'image_url' => $person->image_url,
                'period' => $person->period,
                'is_current' => (bool) $person->is_current,
            ]);
        }

        // Return localized data for display
        return response()->json([
            'id' => $person->id,
            'type' => $person->type,
            'name' => $this->getLocalizedValue($person->names, $lang, ''),
            'message' => $this->getLocalizedValue($person->messages, $lang, null),
            'achievements' => $this->getLocalizedValue($person->achievements, $lang, null),
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

    // upload person image
    public function upload(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:jpeg,png,gif|max:10240', // 10MB max
        ]);

        $file = $validated['file'];
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('persons', $fileName, 'public');

        return response()->json([
            'image_url' => asset('storage/' . $path),
        ], 201);
    }
}
