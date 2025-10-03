<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'admin',
            'nama' => 'Administrator Sistem',
            'email' => 'admin@alsintan.klaten.go.id',
            'password' => Hash::make('admin123'),
            'role' => 'admin'
        ]);

        User::create([
            'username' => 'staff_dinas',
            'nama' => 'Staff Dinas Pertanian',
            'email' => 'staff@alsintan.klaten.go.id',
            'password' => Hash::make('staff123'),
            'role' => 'staff'
        ]);
    }
}
