<?php

namespace App\Http\Controllers;

use App\Jobs\SendPasswordResetEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request)
    {
        // Get language from X-React-I18n header, default to 'en'
        $language = $request->header('X-React-I18n', 'en');

        $request->validate(['email' => 'required|email']);

        $email = $request->email;

        // Check if email exists
        $userExists = DB::table('users')->where('email', $email)->exists();
        if (!$userExists) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        // Generate reset token
        $token = Str::random(64);

        // Store token in database
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        // Generate reset URL
        $resetUrl = env('FRONTEND_URL', 'http://localhost:3000') . '/reset-password?token=' . $token . '&email=' . urlencode($email);

        // Dispatch async job with language
        SendPasswordResetEmail::dispatch($email, $token, $resetUrl, $language)->onQueue('reset_password_mails');

        return response()->json(['message' => 'Reset link sent to your email']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Password reset successfully'])
            : response()->json(['message' => 'Invalid token or email'], 400);
    }
}