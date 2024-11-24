<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request; 
use App\Models\User; // ดึง Model User มาใช้งาน
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Facades\Hash; // สำหรับการตรวจสอบรหัสผ่าน
use Illuminate\Support\Facades\Validator; // สำหรับการตรวจสอบข้อมูลที่ส่งมา
use Illuminate\Support\Str; // ใช้สำหรับการสร้าง token แบบสุ่ม

class UserController extends Controller
{
    public function test(Request $req)
    {
        return response()->json(['msg' => 'Hello World']);
    }

    public function getUser(Request $req, $id)
    {
        try {
            // ดึงข้อมูลจากตาราง 'users' ตาม id ที่ระบุ
            $userData = User::where('id', $id)->first();
            if ($userData) {
                // พบข้อมูลผู้ใช้ ส่งคืนข้อมูลในรูปแบบ JSON
                return response()->json(['msg' => 'ok', 'data' => $userData]);
            } else {
                // ไม่พบข้อมูลผู้ใช้
                return response()->json(['msg' => 'error', 'error' => 'Record not found']);
            }
        } catch (\Exception $e) {
            // จัดการกรณีเกิดข้อผิดพลาด
            return response()->json(['msg' => 'error', 'error' => $e->getMessage()]);
        }
    }

    // ฟังก์ชัน login โดยใช้ username และ password
    public function login(Request $req)
    {
        // ตรวจสอบข้อมูลที่รับมา
        $validator = Validator::make($req->all(), [
            'username' => 'required',
            'password' => 'required',
        ]);

        // ตรวจสอบว่าข้อมูลถูกต้องหรือไม่
        if ($validator->fails()) {
            return response()->json(['msg' => 'error', 'error' => $validator->errors()], 400);
        }

        // ดึงข้อมูลผู้ใช้จาก username
        $user = User::where('username', $req->username)->first();

        //if ($user && Hash::check($req->password, $user->password)) { //กรณีเข้ารหัส
            if ($user && $req->password === $user->password) {          
            // สร้าง token แบบสุ่ม
            $token = base64_encode(Str::random(40));

            // เก็บ token ลงใน database (หรือตั้งค่าอื่นตามที่ต้องการ)
            // $user->api_token = $token;
            // $user->save();

           //return response()->json(['msg' => 'ok', 'data' => $user,'token' => $token]);
           return response()->json(['level' => $user->level, 'id' => $user->id,'token' => $token]);
        } else {
            return response()->json(['msg' => 'error', 'error' => 'Invalid username or password'], 401);
        }
    }
}