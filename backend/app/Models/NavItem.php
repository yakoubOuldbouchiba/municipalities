<?php

namespace App\Models;

use App\Casts\DoubleEncodedJson;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class NavItem extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    protected $fillable = ['label', 'icon', 'path', 'module_id', 'enabled'];

    protected $casts = [
        'label' => DoubleEncodedJson::class,
        'enabled' => 'boolean',
    ];

    /**
     * Get the module that owns this nav item.
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the roles associated with this nav item.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'nav_item_role');
    }
}
