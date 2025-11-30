<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'label', 'color', 'icon'];

    protected $casts = [
        'label' => 'array',
    ];

    /**
     * Get the nav items for this module.
     */
    public function navItems(): HasMany
    {
        return $this->hasMany(NavItem::class);
    }
}
