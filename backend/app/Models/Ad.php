<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class Ad extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    protected $fillable = ['title', 'description', 'link', 'file_type', 'hidden'];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
        'hidden' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('notHidden', function (Builder $builder) {
            $builder->where('hidden', false);
        });
    }

    /**
     * Hide this ad.
     */
    public function hide(): void
    {
        $this->update(['hidden' => true]);
    }

    /**
     * Show this ad.
     */
    public function show(): void
    {
        $this->update(['hidden' => false]);
    }

    /**
     * Get all ads including hidden ones.
     */
    public static function withHidden()
    {
        return static::withoutGlobalScope('notHidden');
    }
}
