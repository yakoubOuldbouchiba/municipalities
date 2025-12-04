<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class Potential extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    protected $fillable = ['slug', 'title', 'description'];

    protected $casts = [
        'title' => 'json',
        'description' => 'json',
    ];

    /**
     * Get a localized attribute value.
     *
     * @param string $attribute
     * @param string|null $lang
     * @return string|null
     */
    public function getLocalized(string $attribute, ?string $lang = null): ?string
    {
        $lang = $lang ?? app()->getLocale();
        return $this->{$attribute}[$lang] ?? $this->{$attribute}['en'] ?? null;
    }
}
