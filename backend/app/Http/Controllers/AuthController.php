<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        if (Auth::attempt(['email' => $data['email'], 'password' => $data['password']])) {
            $user = Auth::user();

            // user extends Authenticatable which uses HasApiTokens trait
            $token = $user->createToken('auth_token')->plainTextToken;
        } else {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
            'success' => true,
        ]);
    }

    public function register()
    {
        // Registration logic will be implemented here.
    }
}
