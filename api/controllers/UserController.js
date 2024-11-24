// /Users/kanoksak/Desktop/WebApp/nuxtJS/ERP/api/controllers/UserController.js
// นำเข้า ไลบรารี PrismaClient 
const { PrismaClient } = require('@prisma/client');
// สร้าง PrismaClient
const prisma = new PrismaClient();

// นำเข้าไลบรารี jwt 
const jwt = require('jsonwebtoken');
// นำเข้าไลบรารี dotenv
const dotenv = require('dotenv');
const { update } = require('./ProductTypeController');

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
                    status: "active", // User ต้องมีสถานะ "active"
                }
            });

            // ตรวจสอบว่า user ถูกค้นหาพบ
            if (!user) {
                return res.status(401).json({ message: "Invalid username or password" }); // ส่ง error message หาก username หรือ password ผิด
            }

            // สร้าง payload สำหรับ JWT 
            const payload = {
                id: user.id,
                username: user.username,
            }

            // ใช้ secret key ที่กำหนดไว้ใน .env เพื่อ sign token
            const key = process.env.SECRET_KEY; //เรียกค่า SECRET_KEY จาก .env
            const token = jwt.sign(payload, key, { expiresIn: "30d" }); // สร้าง JWT พร้อม expire ใน 30 วัน

            // ส่ง response ตอบกลับ
            res.json({ token: token, level: user.level, id: user.id }); // ส่ง token, level และ id ของ user

        } catch (error) {
            res.status(500).json({ message: error.message }); // ส่ง error message หากเกิด error
        }
    },
    info: async (req, res) => {
        try {
            const token = req.headers.authorization.split(" ")[1]; //  รับ token จาก header authorization
            const payload = jwt.verify(token, process.env.SECRET_KEY); // verify token
            const user = await prisma.user.findUnique({
                select: {
                    username: true,  // ชื่อ property ที่ต้องการค้นหา
                    name:true,
                    level: true    // ชื่อ property ที่ต้องการค้นหา
                },
                where: { id: payload.id } // ค้นหา user โดย ID จาก payload ของ token
            })

            res.json({ result: user }); // ส่ง response เป็น object user 

        } catch (error) {
            res.status(500).json({ message: error.message }); // ส่ง error message หากเกิด error
        }
    },
    update: async (req, res) => {
        try {
            const token = req.headers.authorization.split(" ")[1]; //รับ token จาก header authorization
            const payload = jwt.verify(token, process.env.SECRET_KEY); // verify token
            let oldPassword = '';

            if (req.body.password) {
                oldPassword = req.body.password;
            } else {
                const oldUser = await prisma.user.findUnique({
                    where: {
                        id: payload.id
                    }
                })
                oldPassword = oldUser.password
            }

            await prisma.user.update({
                where: {
                    id: payload.id
                },
                data: {
                    name: req.body.name,
                    username: req.body.username,
                    level: req.body.level,
                    password: oldPassword
                }
            })
            res.json({ message: 'success' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}


