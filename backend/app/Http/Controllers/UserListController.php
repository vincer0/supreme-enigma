<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserListResource;
use App\Models\User;

class UserListController extends Controller
{
    public function index($userId)
    {
        return UserListResource::collection(User::findOrFail($userId)->lists);
    }
}
