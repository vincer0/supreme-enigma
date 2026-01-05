<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserListItem extends Model
{
    /** @use HasFactory<\Database\Factories\UserListItemFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'is_completed',
        'user_list_id',
    ];

    public function userList()
    {
        return $this->belongsTo(UserList::class, 'user_list_id');
    }
}
