<script setup>
//นำ config object มาใช้, config มีค่าสำคัญของโปรแกรม เช่น API server, token name 
import config from '@/config';

// Import axios library for making HTTP requests
import axios from 'axios';

// Import Swal library for creating popup notifications (SweetAlert)
import Swal from 'sweetalert2';

// กำหนด metadata สำหรับหน้าเว็บนี้, รวมถึง layout ที่จะใช้ (admin ในกรณีนี้) 
definePageMeta(
    {
        layout: 'admin',
    }
)

// ตัวแปรแบบ reactive (using refs) เพื่อเก็บข้อมูลโปรไฟล์ผู้ใช้ 
const name = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const level = ref('admin'); // ระดับผู้ใช้เริ่มต้นคือ 'admin'

// เรียก function fetchData เมื่อ component ถูก render เสร็จ
onMounted(async () => {
    fetchData();
});

// ฟังก์ชันทำงานแบบ asynchrous เพื่อเรียกข้อมูลโปรไฟล์จาก API
const fetchData = async () => {
    try {
        // ดึง token ออกจาก local storage โดยใช้ key config.token
        const token = localStorage.getItem(config.token);

        // สร้าง headers object กับ Authorization header ที่มี JWT token
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        // ทำการ GET request ไปที่ endpoint /api/user/info พร้อม headers
        const response = await axios.get(config.apiServer + '/api/user/info', { headers });

        // อัปเดตตัวแปร reactive กับข้อมูลผู้ใช้ที่ fetch มา
        name.value = response.data.result.name;
        username.value = response.data.result.username;
        level.value = response.data.result.level;
        password.value = response.data.result.level;

    } catch (e) {
        // หากเกิด error ระหว่าง API request, ใช้ Swal แสดงข้อความผิดพลาด 
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: e.message
        })

    }
};

const save = async () => {
    try {
        // ดึง token ออกจาก local storage โดยใช้ key config.token
        const token = localStorage.getItem(config.token);
        // สร้าง headers object กับ Authorization header ที่มี JWT token
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        if(password.value !== confirmPassword.value){
            Swal.fire({
                icon:'error',
                title:'Error',
                text:"Password ไม่ตรงกัน",
                showConfirmButton:true
        })
        return;
    }

        const payload = {
            name:name.value,
            username:username.value,
            password:password.value,
            level:level.value,
        };
        const response = await axios.put(config.apiServer + '/api/user/update',payload, { headers });
        Swal.fire({
            icon:'success',
            title: 'บันทึกข้อมูลสำเร็จ',
            text: 'บันทึกข้อมูลสำเร็จ',
            timer:1000
         })
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: e.message
        })
    }
}
</script>


<template>
    <div class="title">ข้อมูลส่วนตัว</div>
    <div class="p-4">
        <div class="">
            <div class="">
                <div class="form-group">
                    <div>ชื่อ</div>
                    <input type="text" class="form-control" v-model="name" />
                    <div class="mt-3">Username</div>
                    <input type="text" class="form-control" v-model="username" />
                    <div class="mt-3">รหัสผ่าน <span class="text-red-600">(ถ้าต้องการเปลี่ยน ให้กรอกข้อมูล)</span></div>
                    <input type="password" class="form-control" v-model="password" />
                    <div class="mt-3">ยืนยันรหัสผ่าน <span class="text-red-600">(ถ้าต้องการเปลี่ยน ให้กรอกข้อมูล)</span></div>
                    <input type="password" class="form-control" v-model="confirmPassword" />
                    <div class="mt-3">สิทธิการเข้าสู่ระบบ</div>
                    <input type="radio" id="admin" v-model="level" value="admin" class="me-1" />
                    <label for="admin" class="me-3">Admin</label>
                    <input type="radio" id="user" v-model="level" value="user" class="me-1" />
                    <label for="user">User</label>

                    <div class="mt-3">
                        <button class="btn btn-primary" @click="save">
                            <i class="fa fa-check mr-1"></i>
                            บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>