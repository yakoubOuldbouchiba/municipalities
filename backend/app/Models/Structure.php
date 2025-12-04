<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Structure extends Model
    {
        use HasFactory;

        protected $fillable = ['label', 'code', 'id_parent'];

        protected $casts = [
            'label' => 'json',
        ];    // Relationship to parent structure
    public function parent()
    {
        return $this->belongsTo(Structure::class, 'id_parent');
    }

    // Relationship to child structures
    public function children()
    {
        return $this->hasMany(Structure::class, 'id_parent');
    }
}
