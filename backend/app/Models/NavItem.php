<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NavItem extends Model
{
    use HasFactory;

    protected $fillable = ['label', 'icon', 'path', 'module_id'];

    protected $casts = [
        'label' => 'array',
    ];

    /**
     * Get the module that owns this nav item.
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}
