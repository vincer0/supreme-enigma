<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $data = $request->validated();
       
        $email = $data['email'];
        $password = $data['password'];
    }

    public function register()
    {
        // Registration logic will be implemented here.
    }
}