<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\Castable;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class DoubleEncodedJson implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array  $attributes
     * @return mixed
     */
    public function get($model, $key, $value, $attributes)
    {
        if (!is_string($value)) {
            return $value;
        }

        $decoded = json_decode($value, true);
        
        // If it decoded to a string (double-encoded), decode again
        if (is_string($decoded)) {
            return json_decode($decoded, true) ?? $value;
        }
        
        return $decoded ?? $value;
    }

    /**
     * Prepare the given value for storage.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array  $attributes
     * @return mixed
     */
    public function set($model, $key, $value, $attributes)
    {
        if (is_array($value) || is_object($value)) {
            return json_encode($value);
        }
        
        return $value;
    }
}
