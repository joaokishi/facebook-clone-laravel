<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['post_id', 'user_id', 'content'];

    /**
     * The user who created the comment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The post this comment belongs to.
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
