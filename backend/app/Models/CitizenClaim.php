<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class CitizenClaim extends Model implements Auditable
{
    use HasFactory, SoftDeletes, AuditableTrait;

    protected $fillable = [
        'reference_number',
        'firstname',
        'lastname',
        'email',
        'phone',
        'nin',
        'language',
        'address',
        'content',
        'files',
        'status',
        'answer',
        'answered_at',
    ];

    protected $casts = [
        'files' => 'array',
        'answered_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the max number of files allowed
     */
    public const MAX_FILES = 3;

    /**
     * Scope to get pending claims
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get answered claims
     */
    public function scopeAnswered($query)
    {
        return $query->where('status', 'answered');
    }

    /**
     * Scope to get claims older than specified months
     */
    public function scopeOlderThan($query, $months)
    {
        return $query->whereDate('created_at', '<=', now()->subMonths($months));
    }

    /**
     * Scope to get claims by NIN
     */
    public function scopeByNin($query, $nin)
    {
        return $query->where('nin', $nin);
    }

    /**
     * Check if NIN has reached rate limit (3 claims)
     */
    public static function hasReachedRateLimit($nin)
    {
        return self::byNin($nin)->count() >= 3;
    }

    /**
     * Mark claim as answered
     */
    public function markAsAnswered($answer)
    {
        $this->update([
            'status' => 'answered',
            'answer' => $answer,
            'answered_at' => now(),
        ]);
    }

    /**
     * Archive this claim
     */
    public function archive()
    {
        $this->update(['status' => 'archived']);
    }
}
