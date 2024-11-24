<script setup>
//นำเข้า axios สำหรับทำ request API
import axios from 'axios' 
//นำเข้า SweetAlert2 สำหรับ alert ข้อความ
import Swal from 'sweetalert2' 
//นำเข้า config สำหรับค่า server api
import config from '@/config'

//ประกาศ ref username และ password
const username = ref('')
const password = ref('')

//ฟังชั่น handleSubmit จะถูกเรียกเมื่อ form ถูก submit
const handleSubmit = async () => {
    try {
        //ตรวจสอบว่า username และ password ไม่เป็น null หรือ "" 
        if (!username.value || !password.value) {
            //แสดง alert ข้อความผิดพลาด Username and Password is required
            Swal.fire({
                icon: 'error',
                title: "Oops!",
                text: "Username and Password is required",
            })
        } else {
            //ส่ง request API POST ไปที่ ${config.apiServer}/api/user/signIn
            const response = await axios.post(`${config.apiServer}/api/user/signIn`, {
                username: username.value,
                password: password.value,
            })

            //ตรวจสอบ status code ของการ request API
            if (response.status === 200) {
                //แสดงข้อมูล response ใน console
                console.log(response.data); 
                //เก็บ token จาก response.data.token ลงใน localStorage
                localStorage.setItem(config.token, response.data.token);
                //เก็บ id ของ user ลงใน localStorage (Laravel API)
                localStorage.setItem('nuxt_erp_user_id', response.data.id);

                //ไปหน้า home
                navigateTo('/home'); // ใช้ navigateTo() 
            } else {
                //แสดง alert ข้อความผิดพลาด Invalid username or password
                Swal.fire({
                    icon: 'error',
                    title: "Oops!",
                    text: 'Invalid username or password',
                })
            }
        }

    } catch (error) {
        //แสดง alert ข้อความ error โดยแสดง title และ message ของ error
        Swal.fire({
            icon: 'error',
            title: error,
            text: error.message,
        })
    }

}

</script>


<template>
    <!-- ส่วน template -->
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-t from-blue-900 to-blue-100">
        <!-- ส่วน login form -->
        <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">

            <!-- Heading ของ Login Form -->
            <h2 class="text-3xl font-bold text-gray-900 text-center">
                Sing In to Nuxt ERP
            </h2>

            <!-- ฟอร์ม login -->
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <!-- input Username -->
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <div>Username</div>
                        <input v-model="username" required class="form-control" placeholder="Username">
                    </div>

                    <!-- input Password -->
                    <div class="pt-5">
                        <div>Password</div>
                        <input type="password" v-model="password" required class="form-control" placeholder="Password" />
                    </div>

                </div>

                <!-- ส่วน checkbox และ link forgot password -->
                <div class="flex items-center justify-between">
                    <div class="flex">
                        <input id="remember_me" type="checkbox"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded">
                        <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
                    </div>

                    <div class="text-sm">
                        <a href="#" class="font-medium text-indigo-600 @hover: text-indigo-500">
                            forgot Your password?
                        </a>
                    </div>
                </div>


                <!-- button submit -->
                <div>
                    <button type="submit" class="btn-full">Sign In</button>
                </div>
            </form>
        </div>

    </div>
</template>