<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'date',
        'description',
        'icon',
        'color'
    ];

    protected $casts = [
        'description' => 'array', // store multilingual content as JSON
    ];
}
