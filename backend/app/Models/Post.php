<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'content'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // *** ADD THIS METHOD ***
    public function comments()
    {
        return $this->hasMany(Comment::class)->latest();
    }
}