// /Users/kanoksak/Desktop/WebApp/nuxtJS/ERP/api/controllers/UserController.js
const { PrismaClient } = require('@prisma/client'); // นำเข้า 라이บรารี PrismaClient
const prisma = new PrismaClient(); // สร้างインスタンスของPrismaClient
const jwt = require('jsonwebtoken'); // นำเข้าไลบรารี jwt 
const dotenv = require('dotenv'); // นำเข้าไลบรารี dotenv

// โหลด Environment Variables จากไฟล์ .env
dotenv.config();

module.exports = {
    signIn: async (req, res) => { // ฟังก์ชันสำหรับ login
        try {
            // รับ username และ password จาก request body
            req.body.username = req.body.username;
            req.body.password = req.body.password;

            // ตรวจสอบว่า username และ password มีค่า 
            if (!req.body.username || !req.body.password) {
                return res.status(401).json({ message: "Username and password are required" }); // ส่ง error message หาก username หรือ password ไม่ครบ

            }
            // ค้นหา user ในฐานข้อมูล 
            const user = await prisma.user.findFirst({ 
                where: { // เงื่อนไขการค้นหา
                     username: req.body.username, // Username ต้องตรงกับที่ส่งมา
                     password: req.body.password, // Password ต้องตรงกับที่ส่งมา
                     status:"active", // User ต้องมีสถานะ "active"
                    } 
            });

            // ตรวจสอบว่า user ถูกค้นหาพบ
            if (!user) {
                return res.status(401).json({ message: "Invalid username or password" }); // ส่ง error message หาก username หรือ password ผิด
                }

            // สร้าง payload สำหรับ JWT 
            const payload ={
                id:user.id,
                username: user.username,
            }

            // ใช้ secret key ที่กำหนดไว้ใน .env เพื่อ sign token
            const key = process.env.SECRET_KEY;
            const token = jwt.sign(payload,key,{expiresIn:"30d"}); // สร้าง JWT พร้อม expire ใน 30 วัน

            // ส่ง response ตอบกลับ
            res.json({ token:token,level:user.level ,id: user.id }); // ส่ง token, level และ id ของ user

        } catch (error) {
            res.status(500).json({ message: error.message }); // ส่ง error message หากเกิด error
        }
    }
}
