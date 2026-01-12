<?php

namespace App\Http\Controllers;

use App\Models\OrganizationClaim;
use App\Jobs\SendClaimSubmittedEmail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class OrganizationClaimController extends Controller
{
    /**
     * Store a newly created organization claim.
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
                'email' => 'required|email',
                'phone' => 'required|string|max:20',
                'address' => 'required|string',
                'content' => 'required|string',
                'files' => 'nullable|array|max:3',
                'files.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120', // 5MB max per file
            ]);

            // Check rate limit: same company can only make 3 claims
            if (OrganizationClaim::hasReachedRateLimit($validated['company'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your organization has reached the maximum number of claims allowed.',
                ], 429); // Too Many Requests
            }

            // Handle file uploads
            $files = [];
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $path = $file->store('organization-claims', 'public');
                    $files[] = $path;
                }
            }

            // Create the claim
            $referenceNumber = $this->generateReferenceNumber('ORG');
            $claim = OrganizationClaim::create([
                'reference_number' => $referenceNumber,
                'company' => $validated['company'],
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
                'Organization',
                $validated['content'],
                $language
            );

            // Build file URLs
            $fileUrls = array_map(fn($file) => asset('storage/' . $file), $files);

            return response()->json([
                'success' => true,
                'message' => 'Your organization claim has been submitted successfully.',
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
        while (OrganizationClaim::where('reference_number', $referenceNumber)->exists()) {
            $random = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 6));
            $referenceNumber = $prefix . '-' . $timestamp . '-' . $random;
        }
        
        return $referenceNumber;
    }
}
