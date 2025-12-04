<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class Ad extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    protected $fillable = ['title', 'description', 'link', 'file_type'];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
    ];
}
