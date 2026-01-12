<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CitizenClaim;
use App\Models\CompanyClaim;
use App\Models\OrganizationClaim;
use App\Jobs\SendClaimAnsweredEmail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClaimsAdminController extends Controller
{
    /**
     * Get all citizen claims
     */
    public function citizenIndex(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $query = CitizenClaim::query();

        if ($status && in_array($status, ['pending', 'answered', 'archived'])) {
            $query->where('status', $status);
        }

        $claims = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $claims->items(),
            'pagination' => [
                'current_page' => $claims->currentPage(),
                'per_page' => $claims->perPage(),
                'total' => $claims->total(),
                'last_page' => $claims->lastPage(),
            ]
        ]);
    }

    /**
     * Get a single citizen claim
     */
    public function citizenShow($id): JsonResponse
    {
        $claim = CitizenClaim::find($id);

        if (!$claim) {
            return response()->json([
                'success' => false,
                'message' => 'Citizen claim not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $claim
        ]);
    }

    /**
     * Answer a citizen claim
     */
    public function answerCitizenClaim(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'answer' => 'required|string'
        ]);

        $claim = CitizenClaim::find($id);

        if (!$claim) {
            return response()->json([
                'success' => false,
                'message' => 'Citizen claim not found'
            ], 404);
        }

        $claim->markAsAnswered($validated['answer']);

        // Send email to the person who made the claim using the stored language
        SendClaimAnsweredEmail::dispatch(
            $claim->email,
            $claim->firstname . ' ' . $claim->lastname,
            'Citizen',
            $validated['answer'],
            $claim->language
        );

        return response()->json([
            'success' => true,
            'message' => 'Claim answered successfully',
            'data' => $claim
        ]);
    }

    /**
     * Delete a citizen claim
     */
    public function destroyCitizenClaim($id): JsonResponse
    {
        $claim = CitizenClaim::find($id);

        if (!$claim) {
            return response()->json([
                'success' => false,
                'message' => 'Citizen claim not found'
            ], 404);
        }

        $claim->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Claim deleted successfully'
        ]);
    }

    /**
     * Get all company claims
     */
    public function companyIndex(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $query = CompanyClaim::query();

        if ($status && in_array($status, ['pending', 'answered', 'archived'])) {
            $query->where('status', $status);
        }

        $claims = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $claims->items(),
            'pagination' => [
                'current_page' => $claims->currentPage(),
                'per_page' => $claims->perPage(),
                'total' => $claims->total(),
                'last_page' => $claims->lastPage(),
            ]
        ]);
    }

    /**
     * Get a single company claim
     */
    public function companyShow($id): JsonResponse
    {
        $claim = CompanyClaim::find($id);

        if (!$claim) {
            return response()->json([
                'success' => false,
                'message' => 'Company claim not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $claim
        ]);
    }

    /**
     * Answer a company claim
     */
    public function answerCompanyClaim(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'answer' => 'required|string'
        ]);

        $claim = CompanyClaim::find($id);

        if (!$claim) {
            return response()->json([
                'success' => false,
                'message' => 'Company claim not found'
            ], 404);
        }

        $claim->markAsAnswered($validated['answer']);

        // Send email to the company using the stored language
        SendClaimAnsweredEmail::dispatch(
            $claim->email,
            $claim->company,
            'Company',
            $validated['answer'],
            $claim->language
        );

        return response()->json([
            'success' => true,
            'message' => 'Claim answered successfully',
            'data' => $claim
        ]);
    }

    /**
     * Delete a company claim
     */
    public function destroyCompanyClaim($id): JsonResponse
    {
        $claim = CompanyClaim::find($id);

        if (!$claim) {
            return response()->json([
                'success' => false,
                'message' => 'Company claim not found'
            ], 404);
        }

        $claim->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Claim deleted successfully'
        ]);
    }

    /**
     * Get all organization claims
     */
    public function organizationIndex(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $query = OrganizationClaim::query();

        if ($status && in_array($status, ['pending', 'answered', 'archived'])) {
            $query->where('status', $status);
        }

        $claims = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $claims->items(),
            'pagination' => [
                'current_page' => $claims->currentPage(),
                'per_page' => $claims->perPage(),
                'total' => $claims->total(),
                'last_page' => $claims->lastPage(),
            ]
        ]);
    }

    /**
     * Get a single organization claim
     */
    public function organizationShow($id): JsonResponse
    {
        $claim = OrganizationClaim::find($id);

        if (!$claim) {
            return response()->json([
                'success' => false,
                'message' => 'Organization claim not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $claim
        ]);
    }

    /**
     * Answer an organization claim
     */
    public function answerOrganizationClaim(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'answer' => 'required|string'
        ]);

        $claim = OrganizationClaim::find($id);

        if (!$claim) {
            return response()->json([
                'success' => false,
                'message' => 'Organization claim not found'
            ], 404);
        }

        $claim->markAsAnswered($validated['answer']);

        // Send email to the organization using the stored language
        SendClaimAnsweredEmail::dispatch(
            $claim->email,
            $claim->company,
            'Organization',
            $validated['answer'],
            $claim->language
        );

        return response()->json([
            'success' => true,
            'message' => 'Claim answered successfully',
            'data' => $claim
        ]);
    }

    /**
     * Delete an organization claim
     */
    public function destroyOrganizationClaim($id): JsonResponse
    {
        $claim = OrganizationClaim::find($id);

        if (!$claim) {
            return response()->json([
                'success' => false,
                'message' => 'Organization claim not found'
            ], 404);
        }

        $claim->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Claim deleted successfully'
        ]);
    }

    /**
     * Archive claims older than 3 months
     */
    public function archiveOldClaims(): JsonResponse
    {
        $months = 3;
        
        $citizenArchived = CitizenClaim::olderThan($months)->update(['status' => 'archived']);
        $companyArchived = CompanyClaim::olderThan($months)->update(['status' => 'archived']);
        $organizationArchived = OrganizationClaim::olderThan($months)->update(['status' => 'archived']);

        return response()->json([
            'success' => true,
            'message' => 'Old claims archived successfully',
            'archived' => [
                'citizen' => $citizenArchived,
                'company' => $companyArchived,
                'organization' => $organizationArchived,
            ]
        ]);
    }

    /**
     * Purge (permanently delete) old answered claims (after 1 month)
     */
    public function purgeOldClaims(): JsonResponse
    {
        $months = 1;
        
        $citizenPurged = CitizenClaim::where('status', 'answered')
            ->where('answered_at', '<=', now()->subMonths($months))
            ->forceDelete();
            
        $companyPurged = CompanyClaim::where('status', 'answered')
            ->where('answered_at', '<=', now()->subMonths($months))
            ->forceDelete();
            
        $organizationPurged = OrganizationClaim::where('status', 'answered')
            ->where('answered_at', '<=', now()->subMonths($months))
            ->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Old answered claims purged successfully',
            'purged' => [
                'citizen' => $citizenPurged,
                'company' => $companyPurged,
                'organization' => $organizationPurged,
            ]
        ]);
    }
}
