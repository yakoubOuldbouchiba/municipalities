<?php

namespace App\Http\Controllers;

use App\Models\Structure;
use Illuminate\Http\Request;

class StructureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Structure::with('parent', 'children')->get();
    }

    /**
     * Get structures as a tree hierarchy
     */
    public function tree()
    {
        $roots = Structure::whereNull('id_parent')->with('children')->get();
        return $this->buildTree($roots);
    }

    /**
     * Build tree structure recursively
     */
    private function buildTree($structures)
    {
        return $structures->map(function ($structure) {
            return [
                'id' => $structure->id,
                'label' => $structure->label,
                'code' => $structure->code,
                'id_parent' => $structure->id_parent,
                'children' => $this->buildTree($structure->children ?? []),
            ];
        })->values();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Structure::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|json',
            'code' => 'required|string|max:255|unique:structures,code',
            'id_parent' => 'nullable|exists:structures,id',
        ]);

        return Structure::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Structure $structure)
    {
        return $structure->load('parent', 'children');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Structure $structure)
    {
        return $structure;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Structure $structure)
    {
        $validated = $request->validate([
            'label' => 'required|json',
            'code' => 'required|string|max:255|unique:structures,code,' . $structure->id,
            'id_parent' => 'nullable|exists:structures,id',
        ]);

        $structure->update($validated);
        return $structure;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Structure $structure)
    {
        $structure->delete();
        return response()->json(['message' => 'Structure deleted successfully']);
    }
}
