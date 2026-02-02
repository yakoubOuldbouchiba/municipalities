<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class Potential extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    protected $fillable = ['slug', 'title', 'description', 'hidden'];

    protected $casts = [
        'title' => 'json',
        'description' => 'json',
        'hidden' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('notHidden', function (Builder $builder) {
            $builder->where('hidden', false);
        });
    }

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

    /**
     * Hide this potential.
     */
    public function hide(): void
    {
        $this->update(['hidden' => true]);
    }

    /**
     * Show this potential.
     */
    public function show(): void
    {
        $this->update(['hidden' => false]);
    }

    /**
     * Get all potentials including hidden ones.
     */
    public static function withHidden()
    {
        return static::withoutGlobalScope('notHidden');
    }
}
