<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class QuickLink extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'label',
        'url',
        'hidden',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'label' => 'array',
        'hidden' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('notHidden', function (Builder $builder) {
            $builder->where('hidden', false);
        });
    }

    /**
     * Hide this link.
     */
    public function hide(): void
    {
        $this->update(['hidden' => true]);
    }

    /**
     * Show this link.
     */
    public function show(): void
    {
        $this->update(['hidden' => false]);
    }

    /**
     * Get all links including hidden ones.
     */
    public static function withHidden()
    {
        return static::withoutGlobalScope('notHidden');
    }
}
