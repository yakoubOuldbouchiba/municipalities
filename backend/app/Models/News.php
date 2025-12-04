<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class News extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    protected $fillable = ['title', 'description', 'fileUrl'];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
    ];
}
