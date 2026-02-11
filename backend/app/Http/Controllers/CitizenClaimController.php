<?php

namespace App\Http\Controllers;

use App\Models\CitizenClaim;
use App\Jobs\SendClaimSubmittedEmail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class CitizenClaimController extends Controller
{
    /**
     * Store a newly created citizen claim.
     * Public endpoint - no authentication required
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Get language from X-React-I18n header, default to 'en'
            $language = $request->header('X-React-I18n', 'en');

            // Validate input
            $validated = $request->validate([
                'firstname' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'email' => 'required|email',
                'phone' => 'required|string|max:20',
                'nin' => 'required|numeric|digits:18',
                'address' => 'required|string',
                'content' => 'required|string',
                'files' => 'nullable|array|max:3',
                'files.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120', // 5MB max per file
            ]);

            // Check rate limit: same NIN can only make 3 claims
            if (CitizenClaim::hasReachedRateLimit($validated['nin'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have reached the maximum number of claims allowed.',
                ], 429); // Too Many Requests
            }

            // Handle file uploads
            $files = [];
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $path = $file->store('citizen-claims', 'public');
                    $files[] = $path;
                }
            }

            // Create the claim
            $referenceNumber = $this->generateReferenceNumber('CC');
            $claim = CitizenClaim::create([
                'reference_number' => $referenceNumber,
                'firstname' => $validated['firstname'],
                'lastname' => $validated['lastname'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'nin' => $validated['nin'],
                'language' => $language,
                'address' => $validated['address'],
                'content' => $validated['content'],
                'files' => $files ?: null,
                'status' => 'pending',
            ]);

            // Send email via queue with language
            SendClaimSubmittedEmail::dispatch(
                $validated['email'],
                $validated['firstname'] . ' ' . $validated['lastname'],
                'Citizen',
                $validated['content'],
                $language
            );

            // Build file URLs
            $fileUrls = array_map(fn($file) => asset('storage/' . $file), $files);

            return response()->json([
                'success' => true,
                'message' => 'Your claim has been submitted successfully.',
                'claim_id' => $claim->id,
                'reference_number' => $referenceNumber,
                'files' => $fileUrls,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while submitting your claim.',
            ], 500);
        }
    }

    /**
     * Generate a unique reference number
     */
    private function generateReferenceNumber(string $prefix): string
    {
        $timestamp = now()->format('YmdHi');
        $random = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 6));
        $referenceNumber = $prefix . '-' . $timestamp . '-' . $random;
        
        // Ensure uniqueness
        while (CitizenClaim::where('reference_number', $referenceNumber)->exists()) {
            $random = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 6));
            $referenceNumber = $prefix . '-' . $timestamp . '-' . $random;
        }
        
        return $referenceNumber;
    }
}