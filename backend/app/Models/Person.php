<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    use HasFactory;
    
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
