<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class HomeImage extends Model implements Auditable
{
    use HasFactory, AuditableTrait;

    protected $fillable = ['url', 'captions', 'hidden'];

    protected $casts = [
        'captions' => 'array',
        'hidden' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('notHidden', function (Builder $builder) {
            $builder->where('hidden', false);
        });
    }

    /**
     * Hide this image.
     */
    public function hide(): void
    {
        $this->update(['hidden' => true]);
    }

    /**
     * Show this image.
     */
    public function show(): void
    {
        $this->update(['hidden' => false]);
    }

    /**
     * Get all images including hidden ones.
     */
    public static function withHidden()
    {
        return static::withoutGlobalScope('notHidden');
    }
}
