<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tool extends Model
{
    protected $fillable = [
        'code',
        'label',
        'description',
        'icon',
        'url',
        'color',
        'order',
        'active',
    ];

    protected $casts = [
        'label' => 'json',
        'description' => 'json',
        'active' => 'boolean',
    ];

    /**
     * Get the roles associated with this tool
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_tool');
    }

    /**
     * Scope to get active tools only
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope to get tools by role
     */
    public function scopeByRole($query, $roleIds)
    {
        return $query->whereHas('roles', function ($subQuery) use ($roleIds) {
            $subQuery->whereIn('role_tool.role_id', $roleIds);
        });
    }

    /**
     * Scope to get tools ordered
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('created_at');
    }
}
