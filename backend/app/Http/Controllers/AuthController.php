<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\SendWelcomeEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        // Get language from X-React-I18n header, default to 'en'
        $language = $request->header('X-React-I18n', 'en');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed'
        ]);

        $plainPassword = $validated['password'];

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'firstname' => json_encode(['en' => $validated['name']]),
            'lastname' => json_encode(['en' => '']),
            'birthdate' => date('Y-m-d'),
            'birthplace' => 'Unknown',
            'nin' => uniqid(),
            'gender' => 'male',
            'address' => json_encode(['en' => '']),
        ]);

        // Queue email job directly with language
        SendWelcomeEmail::dispatch($user, $plainPassword, $language)->onQueue('registered_users_mails');

        return response()->json(['message' => 'User registered successfully'], 201);
    }
    // Login -> returns token
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Optionally restrict by role (admin) here
        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    // Revoke current token (logout)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    // Refresh token (generate new token, delete old one)
    public function refreshToken(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Delete current token
        $request->user()->currentAccessToken()->delete();

        // Create new token
        $newToken = $user->createToken('token')->plainTextToken;

        return response()->json([
            'token' => $newToken,
            'user' => $user
        ]);
    }
}