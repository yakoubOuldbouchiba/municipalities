<?php

namespace App\Http\Controllers\Api;

use App\Models\Tool;
use Illuminate\Http\Request;

class ToolController extends \App\Http\Controllers\Controller
{
    /**
     * Get all tools accessible by the authenticated user
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            // Get user's role IDs
            $roleIds = $user->roles()->pluck('id')->toArray();

            // Fetch active tools that the user has access to
            $tools = Tool::active()
                ->byRole($roleIds)
                ->ordered()
                ->get()
                ->map(function ($tool) {
                    return [
                        'id' => $tool->id,
                        'code' => $tool->code,
                        'label' => $tool->label,
                        'description' => $tool->description,
                        'icon' => $tool->icon,
                        'url' => $tool->url,
                        'color' => $tool->color,
                        'order' => $tool->order,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $tools
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching tools: ' . $e->getMessage()
            ], 500);
        }
    }
}
