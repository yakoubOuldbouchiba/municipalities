<?php

namespace App\Models;

use App\Casts\DoubleEncodedJson;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class Module extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    protected $fillable = ['code', 'label', 'color', 'icon', 'enabled'];

    protected $casts = [
        'label' => DoubleEncodedJson::class,
        'enabled' => 'boolean',
    ];

    /**
     * Get the nav items for this module.
     */
    public function navItems(): HasMany
    {
        return $this->hasMany(NavItem::class);
    }

    /**
     * Get the roles associated with this module.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'module_role');
    }
}
