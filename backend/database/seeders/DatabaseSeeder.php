<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $userList = $user->lists()->create([
            'name' => 'Groceries',
        ]);

        $userList->items()->createMany([
            ['name' => 'Milk', 'is_completed' => false],
            ['name' => 'Bread', 'is_completed' => true],
            ['name' => 'Eggs', 'is_completed' => false],
        ]);
    }
}
