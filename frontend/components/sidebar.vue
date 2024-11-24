<script setup>
import { ref } from 'vue'

const activeMenu = ref('');

const toggleMenu = (menu) => {
    activeMenu.value = menu;
}

</script>


<template>
    <div>
        <div class="sidebar-title">NuxtERP v.2024</div>
        <div class="sidebar-avatar">
            <img src="https://cdn.pixabay.com/photo/2024/11/07/03/12/lizard-9179598_1280.jpg" alt="avatar"
                class="w-10 h-10 rounded-full mx-auto">
            <div class="text-center text-wite text-sm mt-3">Admin System</div>
            <div class="text-center mt-3">
                <button class="btn btn-danger text-xs block w-full">
                    <i class="fa fa-sign-out mr-1"></i>
                    Sign Out
                </button>
                <button class="btn btn-primary text-xs block w-full mt-2">
                    <i class="fa fa-user mr-1"></i>
                    Sign In
                </button>
            </div>
        </div>
        <div class="sidebar-menu">
            <NuxtLink class="nav-link" :class="{ 'active': activeMenu === 'home' }" to="/home"
                @click="toggleMenu('home')">
                <i class="fa fa-home"></i>
                Dashboard
            </NuxtLink>
            <NuxtLink class="nav-link" :class="{ 'active': activeMenu === 'productType' }" to="/productType"
                @click="toggleMenu('productType')">
                <i class="fa fa-file-alt"></i>
                ประเภทสินค้า
            </NuxtLink>
        </div>
    </div>
</template>