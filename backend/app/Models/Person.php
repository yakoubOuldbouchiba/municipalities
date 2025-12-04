<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class Person extends Model implements Auditable
{
    use HasFactory, AuditableTrait;
    
    protected $table = 'persons';
    
    protected $fillable = [
        'type',
        'names',
        'messages',
        'achievements',
        'image_url',
        'period',
        'is_current',
    ];

    protected $casts = [
        'names' => 'array',
        'messages' => 'array',
        'achievements' => 'array',
        'is_current' => 'boolean',
    ];
}
