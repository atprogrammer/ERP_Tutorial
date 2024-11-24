<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController; //นำเข้า controller
use App\Http\Controllers\ProductTypeController; //นำเข้า controller
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });



Route::get('/test',[UserController::class,'test']); //เพิ่มข้อมูล
Route::get('/getUser/{id}', [UserController::class, 'getUser']);



//  login
Route::post('/user/signIn',[UserController::class,'login']); //เพิ่มข้อมูล


//Product Type
Route::post('/productType/create',[ProductTypeController::class,'create']); //เพิ่มข้อมูล