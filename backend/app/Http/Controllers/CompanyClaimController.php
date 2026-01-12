<?php

namespace App\Http\Controllers;

use App\Models\CompanyClaim;
use App\Jobs\SendClaimSubmittedEmail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class CompanyClaimController extends Controller
{
    /**
     * Store a newly created company claim.
     * Public endpoint - no authentication required
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Get language from X-React-I18n header, default to 'en'
            $language = $request->header('X-React-I18n', 'en');

            // Validate input
            $validated = $request->validate([
                'company' => 'required|string|max:255',
                'register_number' => 'required|string|max:255',
                'email' => 'required|email',
                'phone' => 'required|string|max:20',
                'address' => 'required|string',
                'content' => 'required|string',
                'files' => 'nullable|array|max:3',
                'files.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120', // 5MB max per file
            ]);

            // Check rate limit: same register_number can only make 3 claims
            if (CompanyClaim::hasReachedRateLimit($validated['register_number'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your company has reached the maximum number of claims allowed.',
                ], 429); // Too Many Requests
            }

            // Handle file uploads
            $files = [];
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $path = $file->store('company-claims', 'public');
                    $files[] = $path;
                }
            }

            // Create the claim
            $referenceNumber = $this->generateReferenceNumber('CMP');
            $claim = CompanyClaim::create([
                'reference_number' => $referenceNumber,
                'company' => $validated['company'],
                'register_number' => $validated['register_number'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'language' => $language,
                'address' => $validated['address'],
                'content' => $validated['content'],
                'files' => $files ?: null,
                'status' => 'pending',
            ]);

            // Send email via queue with language
            SendClaimSubmittedEmail::dispatch(
                $validated['email'],
                $validated['company'],
                'Company',
                $validated['content'],
                $language
            );

            // Build file URLs
            $fileUrls = array_map(fn($file) => asset('storage/' . $file), $files);

            return response()->json([
                'success' => true,
                'message' => 'Your company claim has been submitted successfully.',
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
        while (CompanyClaim::where('reference_number', $referenceNumber)->exists()) {
            $random = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 6));
            $referenceNumber = $prefix . '-' . $timestamp . '-' . $random;
        }
        
        return $referenceNumber;
    }
}
