<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use PhpParser\Node\Expr\Array_;

class OtpCode extends Model
{
    protected $fillable = [
        'phone',
        'code_hash',
        'session_id',
        'expires_at',
        'used_at'
    ];

    protected function casts(): array
    {
        return [
            'code_hash' => 'hashed',
            'expires_at' => 'datetime',
            'used_at' => 'datetime'
        ];
    }
}