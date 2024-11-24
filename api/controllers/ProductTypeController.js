// ไฟล์ ProductTypeController.js  - สำหรับจัดการข้อมูลประเภทสินค้า

const { PrismaClient } = require('@prisma/client'); // นำเข้า 라이บรารี PrismaClient สำหรับทำงานกับฐานข้อมูล

const prisma = new PrismaClient(); // สร้างตัวแปร prisma เป็น instance ของ PrismaClient

// เริ่มต้น export object เพื่อกำหนด API routes 
module.exports = {
    create: async (req, res) => {  
        // ฟังก์ชัน create สำหรับสร้างประเภทสินค้าใหม่

        try { // สลิงการทำงานเพื่อจับ error
            await prisma.productType.create({ // ใช้ prisma เพื่อเพิ่มข้อมูลลงในตาราง productType
                data: { 
                    name: req.body.name, // ตั้งค่า name เป็นชื่อที่ส่งมาจาก request body
                    remark: req.body.remark // ตั้งค่า remark เป็นคำอธิบายที่ส่งมาจาก request body
                }
            });

            // ส่งข้อความว่า "success" ถ้าการทำงานสำเร็จ
            res.send({
                message: 'success' 
            });
        } catch (e) { 
            // หากเกิด error จะทำการ send error code 500 และข้อความ error
            res.status(500).json({ error: e.message });
        }
    },

    list:async (req,res) => {
        try {
            const productTypes = await prisma.productType.findMany({ // ใช้ prisma เพื่อค้นหาข้อมูลจากตาราง productType
            where:{
                status:'active'
            },
            orderBy:{
                createdAt: 'desc'
            }});
            res.json({results:productTypes});
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
    update:async (req,res)=>{
        try {
            await prisma.productType.update({
                where:{
                    id: req.params.id
                 },
                data:{
                    name: req.body.name, 
                    remark: req.body.remark 
                }
             });
            res.send({message:'success'});
         } catch (e) {
            res.status(500).json({ error: e.message });
         }
    },
    remove:async (req,res)=>{
        try {
            await prisma.productType.update({
                where:{
                    id: req.params.id
                  },
                data:{
                    status:'inactive'
                 }
              });
            res.send({message:'success'});
          } catch  (e) {
            res.status(500).json({ error: e.message });
          }
    }
}

