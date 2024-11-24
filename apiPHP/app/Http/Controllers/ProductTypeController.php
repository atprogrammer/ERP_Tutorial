<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductType; // ดึง Model User มาใช้งาน
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator; // สำหรับการตรวจสอบข้อมูลที่ส่งมา

class ProductTypeController extends Controller
{
    public function create(Request $request)
    {
        // ตรวจสอบข้อมูลที่รับเข้ามา
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'remark' => 'required|string|max:255',
        ]);

        // สร้างข้อมูลใหม่ในตาราง product_types
        $productType = new ProductType();
        $productType->name = $validatedData['name'];
        $productType->remark = $validatedData['remark'];
        $productType->save();

        // ส่งกลับข้อความหรือข้อมูลที่บันทึกแล้ว
        return response()->json([
            'msg' => 'ok',
            'data' => $productType
        ], 201);
    }
}
