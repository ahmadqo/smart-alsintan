<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Username atau password salah'
            ], 401);
        }

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'nama' => $user->nama,
                    'email' => $user->email,
                    'role' => $user->role
                ],
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil'
        ]);
    }

    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'Data profil berhasil diambil',
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'nama' => $user->nama,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at->format('d/m/Y H:i'),
                'last_login' => $user->updated_at->format('d/m/Y H:i')
            ]
        ]);
    }

    // get list all users (for admin)
    public function getAllUsers()
    {
        $users = User::all(['id', 'username', 'nama', 'email', 'role', 'created_at', 'updated_at']);
        return response()->json([
            'success' => true,
            'message' => 'Daftar pengguna berhasil diambil',
            'data' => $users
        ]);
    }

    // get user by id (for admin)
    public function getDetailUserById($id)
    {
        $user = User::find($id, ['id', 'username', 'nama', 'email', 'role', 'created_at', 'updated_at']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak ditemukan'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Data pengguna berhasil diambil',
            'data' => $user
        ]);
    }

    // delete user by id (for admin)
    public function deleteUserById($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak ditemukan'
            ], 404);
        }

        // Prevent admin from deleting themselves
        if (auth()->user()->id == $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat menghapus diri sendiri'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil dihapus'
        ]);
    }

    // create new user (for admin)
    public function createUser(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users,username',
            'nama' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,staff'
        ]);
        $user = User::create([
            'username' => $request->username,
            'nama' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil dibuat',
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'nama' => $user->nama,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at->format('d/m/Y H:i'),
            ]
        ], 201);
    }

    // update user by id (for admin)
    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak ditemukan'
            ], 404);
        }
        $request->validate([
            'username' => 'sometimes|required|string|unique:users,username,' . $user->id,
            'nama' => 'sometimes|required|string',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|string|min:6',
            'role' => 'sometimes|required|in:admin,staff'
        ]);
        if ($request->has('username')) {
            $user->username = $request->username;
        }
        if ($request->has('nama')) {
            $user->nama = $request->nama;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }
        if ($request->has('role')) {
            $user->role = $request->role;
        }
        $user->save();
        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil diperbarui',
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'nama' => $user->nama,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at->format('d/m/Y H:i'),
                'updated_at' => $user->updated_at->format('d/m/Y H:i'),
            ]
        ]);
    }
}