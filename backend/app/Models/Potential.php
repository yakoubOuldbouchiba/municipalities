<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Potential extends Model
{
    use HasFactory;

    protected $fillable = ['slug', 'title', 'description'];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
    ];
}
