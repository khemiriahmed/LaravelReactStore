<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // =========================
    //  GET CURRENT USER
    // =========================
    public function me()
    {
        return response()->json([
            'user' => Auth::user()
        ]);
    }

    // =========================
    //  ADMIN: LIST USERS
    // =========================
    public function index()
    {
        return response()->json(
            User::latest()->paginate(10)
        );
    }

    // =========================
    //  ADMIN: SHOW USER
    // =========================
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json($user);
    }

    // =========================
    //  UPDATE PROFILE
    // =========================
    public function update(UpdateProfileRequest $request)
    {
        $user = Auth::user();

        $data = $request->validated();

        // 📸 avatar upload
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = '/storage/' . $path;
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    // =========================
    //  UPDATE PASSWORD
    // =========================
    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'errors' => [
                    'current_password' => ['Incorrect password']
                ]
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Password updated successfully'
        ]);
    }

    // =========================
    // DELETE ACCOUNT (USER)
    // =========================
    public function destroy()
    {
        $user = Auth::user();

        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }
}