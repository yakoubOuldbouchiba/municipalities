<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class HomeImage extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    protected $fillable = ['url', 'captions'];

    protected $casts = [
        'captions' => 'array', // automatically cast JSON to array
    ];
}
