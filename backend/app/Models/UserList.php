<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserList extends Model
{
    /** @use HasFactory<\Database\Factories\UserListFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'user_id',
    ];

    public function items()
    {
        return $this->hasMany(UserListItem::class, 'user_list_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
