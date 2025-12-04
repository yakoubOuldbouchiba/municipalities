<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;



class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) :JsonResponse
    {
        $language = $request->query('language', 'en');
        $active = $request->query('active');
        $search = $request->query('search'); 

        $query = User::with('roles', 'groups', 'structures');

        if($active !== null) {
            $query->where('active', $active=='true' ? 1 : 0 );
        }
        if($search) {
            $query->where(function($q) use ($search, $language) {
                $q->where("name", 'like', "%$search%")
                  ->orWhere("email", 'like', "%$search%")
                  ->orWhere("firstname->$language", 'like', "%$search%")
                  ->orWhere("lastname->$language", 'like', "%$search%");
            });
        }
           
        $users = $query->paginate(15);
        return response()->json($users);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'firstname' => 'required|array',
            'lastname' => 'required|array',
            'name' => 'required|string|max:255|unique:users,name',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'birthdate' => 'nullable|date',
            'birthplace' => 'nullable|array',
            'nin' => 'nullable|string|max:50|unique:users,nin',
            'phone' => 'nullable|string|max:20',
            'iphone' => 'nullable|string|max:20',
            'gender' => 'nullable|in:male,female',
            'photo' => 'nullable|string',
            'address' => 'nullable|json',
            'active' => 'nullable|boolean',
            'roles' => 'nullable|array',
            'groups' => 'nullable|array',
            'structures' => 'nullable|array',
            'structures.*' => 'integer|exists:structures,id',
            'groups.*' => 'integer|exists:groups,id',
            'roles.*' => 'integer|exists:roles,id',
        ]);

        $user = User::create([
            'firstname' => $validated['firstname'],
            'lastname' => $validated['lastname'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'birthdate' => $validated['birthdate'] ?? null,
            'birthplace' => $validated['birthplace'] ?? null,
            'nin' => $validated['nin'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'iphone' => $validated['iphone'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'photo' => $validated['photo'] ?? null,
            'address' => $validated['address'] ?? null,
            'active' => $validated['active'] ?? true,
        ]   );

        // Sync roles, groups, and structures if provided
        if(isset($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        }
        if(isset($validated['groups'])) {
            $user->groups()->sync($validated['groups']);
        }
        if(isset($validated['structures'])) {
            $user->structures()->sync($validated['structures']);
        }

        return response()->json($user, 201);


        
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json($user->load('roles', 'groups', 'structures'));
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'firstname' => 'sometimes|required|array',
            'lastname' => 'sometimes|required|array',
            'name' => 'sometimes|required|string|max:255|unique:users,name,'.$user->id,
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'sometimes|required|string|min:8',
            'birthdate' => 'nullable|date',
            'birthplace' => 'nullable|array',
            'nin' => 'nullable|string|max:50|unique:users,nin,'.$user->id,
            'phone' => 'nullable|string|max:20',
            'iphone' => 'nullable|string|max:20',   
            'gender' => 'nullable|in:male,female',
            'photo' => 'nullable|string',
            'address' => 'nullable|json',
            'active' => 'nullable|boolean',
            'roles' => 'nullable|array',
            'groups' => 'nullable|array',
            'structures' => 'nullable|array',
            'structures.*' => 'integer|exists:structures,id',
            'groups.*' => 'integer|exists:groups,id',
            'roles.*' => 'integer|exists:roles,id',
        ]);
        $updateData = [];
        if(isset($validated['firstname'])) {
            $updateData['firstname'] = $validated['firstname'];
        }
        if(isset($validated['lastname'])) {
            $updateData['lastname'] = $validated['lastname'];
        }   
        if(isset($validated['name'])) {
            $updateData['name'] = $validated['name'];
        }
        if(isset($validated['email'])) {
            $updateData['email'] = $validated['email']; 
        }
        if(isset($validated['password'])) {
            $updateData['password'] = $validated['password'];
        }
        if(isset($validated['birthdate'])) {
            $updateData['birthdate'] = $validated['birthdate'];
        }
        if(isset($validated['birthplace'])) {
            $updateData['birthplace'] = $validated['birthplace'];
        }
        if(isset($validated['nin'])) {
            $updateData['nin'] = $validated['nin'];
        }
        if(isset($validated['phone'])) {
            $updateData['phone'] = $validated['phone']; 
        }   
        if(isset($validated['iphone'])) {
            $updateData['iphone'] = $validated['iphone'];
        }
        if(isset($validated['gender'])) {
            $updateData['gender'] = $validated['gender'];
        }   
        if(isset($validated['photo'])) {
            $updateData['photo'] = $validated['photo'];
        }
        if(isset($validated['address'])) {
            $updateData['address'] = $validated['address'];
        }   
        if(isset($validated['active'])) {
            $updateData['active'] = $validated['active'];
        }
        $user->update($updateData);
        // Sync roles, groups, and structures if provided
        if(isset($validated['roles'])) {
            $user->roles()->sync($validated['roles']);  
        }
        if(isset($validated['groups'])) {
            $user->groups()->sync($validated['groups']);
        }
        if(isset($validated['structures'])) {
            $user->structures()->sync($validated['structures']);
        }
        return response()->json($user->load('roles', 'groups', 'structures'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully'], 204);
    }


}
