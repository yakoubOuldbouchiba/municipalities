<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class Paper extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    protected $fillable = [
        'titles',
        'descriptions',
        'slug',
        'hidden',
    ];

    protected $casts = [
        'titles' => 'array',
        'descriptions' => 'array',
        'hidden' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('notHidden', function (Builder $builder) {
            $builder->where('hidden', false);
        });
    }

    /**
     * Hide this paper.
     */
    public function hide(): void
    {
        $this->update(['hidden' => true]);
    }

    /**
     * Show this paper.
     */
    public function show(): void
    {
        $this->update(['hidden' => false]);
    }

    /**
     * Get all papers including hidden ones.
     */
    public static function withHidden()
    {
        return static::withoutGlobalScope('notHidden');
    }
}
