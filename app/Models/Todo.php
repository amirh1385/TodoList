<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category;

class Todo extends Model
{
    protected $fillable = [
        'title',
        'description',
        'is_completed',
        'category_id'
    ];

    public function category(){
        $this->belongsTo(Category::class);
    }
}
