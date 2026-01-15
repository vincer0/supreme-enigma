<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\UserListResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserListController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $userId = $user->id;

        return UserListResource::collection(User::findOrFail($userId)->lists);
    }
}
