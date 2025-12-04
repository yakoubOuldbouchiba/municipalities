<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class Group extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    protected $fillable = ['code', 'label'];

    protected $casts = [
        'label' => 'array',
    ];

    /**
     * Get the roles associated with this group.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'group_role');
    }
}
