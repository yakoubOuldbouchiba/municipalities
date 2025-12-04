<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class Role extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    protected $fillable = ['code', 'label'];
    
    protected $casts = [
        'label' => 'array',
    ];
    
    /**
     * Set the label attribute - prevent double encoding for JSON column
     */
    public function setLabelAttribute($value)
    {
        // If it's already a JSON string, don't encode it again
        if (is_string($value) && (str_starts_with($value, '{') || str_starts_with($value, '['))) {
            $this->attributes['label'] = $value;
        } else if (is_array($value)) {
            // If it's an array, JSON encode it for storage
            $this->attributes['label'] = json_encode($value);
        } else {
            $this->attributes['label'] = $value;
        }
    }

    /**
     * Get the modules associated with this role.
     */
    public function modules()
    {
        return $this->belongsToMany(Module::class, 'module_role');
    }

    /**
     * Get the nav items associated with this role.
     */
    public function navItems()
    {
        return $this->belongsToMany(NavItem::class, 'nav_item_role');
    }

    /**
     * Get the groups associated with this role.
     */
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_role');
    }
}

