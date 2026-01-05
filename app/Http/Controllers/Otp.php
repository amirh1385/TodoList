<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\OtpCode;
use App\Models\User;

class Otp extends Controller
{
    public function SendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|regex:/^989\d{9}$/'
        ], [
            'phone.required' => 'Phone number is required.',
            'phone.string' => 'Phone number must be a string.',
            'phone.regex' => 'The phone number format is invalid. It should start with 989 followed by 9 digits.'
        ]);

        if($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $phone = $request->input('phone');
        if(app()->environment('production')){
            $code = random_int(100000, 999999);
        } else {
            $code = 123456;
        }
        
        $otpCode = new OtpCode();
        $otpCode->phone = $phone;
        $otpCode->code_hash = $code;
        $otpCode->session_id = session()->getId();
        $otpCode->expires_at = now()->addMinutes(config('otp.expiration_minutes', 300));
        $otpCode->save();

        return response()->noContent();
    }

    public function VerifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|regex:/^989\d{9}$/',
            'code' => 'required|string|size:6'
        ], [
            'phone.required' => 'Phone number is required.',
            'phone.string' => 'Phone number must be a string.',
            'phone.regex' => 'The phone number format is invalid. It should start with 989 followed by 9 digits.',
            'code.required' => 'OTP code is required.',
            'code.string' => 'OTP code must be a string.',
            'code.size' => 'OTP code must be exactly 6 digits.'
        ]);

        if($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $phone = $request->input('phone');
        $code = $request->input('code');

        $user = DB::transaction(function () use ($phone, $code) {
            $otpCode = OtpCode::where('phone', $phone)
                ->where('session_id', session()->getId())
                ->whereNull('used_at')
                ->where('expires_at', '>', now())
                ->lockForUpdate()
                ->latest()
                ->first();

            if (!$otpCode || !Hash::check($code, $otpCode->code_hash)) {
                $response = response()->json(['message' => 'Invalid or expired OTP code.'], 400);
                $response->send();
                exit;
            }

            $otpCode->update(['used_at' => now()]);

            return User::firstOrCreate(['phone' => $phone]); 
        });

        Auth::login($user);

        return response()->noContent();
    }

    public function Logout(){
        Auth::logout();
        return response()->noContent();
    }
}
