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
        'status' => 'json',
        'description' => 'json',
    ];

    /**
     * Get a localized status.
     *
     * @param string|null $lang
     * @return string|null
     */
    public function getLocalizedStatus(?string $lang = null): ?string
    {
        $lang = $lang ?? app()->getLocale();
        return $this->status[$lang] ?? $this->status['en'] ?? null;
    }

    /**
     * Get a localized description.
     *
     * @param string|null $lang
     * @return string|null
     */
    public function getLocalizedDescription(?string $lang = null): ?string
    {
        $lang = $lang ?? app()->getLocale();
        return $this->description[$lang] ?? $this->description['en'] ?? null;
    }
}
