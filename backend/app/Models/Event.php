<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class Event extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    protected $fillable = [
        'status',
        'date',
        'description',
        'icon',
        'color',
        'hidden'
    ];

    protected $casts = [
        'status' => 'json',
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

    /**
     * Hide this event.
     */
    public function hide(): void
    {
        $this->update(['hidden' => true]);
    }

    /**
     * Show this event.
     */
    public function show(): void
    {
        $this->update(['hidden' => false]);
    }

    /**
     * Get all events including hidden ones.
     */
    public static function withHidden()
    {
        return static::withoutGlobalScope('notHidden');
    }
}
