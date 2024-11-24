<script setup>
import axios from 'axios'
import Swal from 'sweetalert2'
import config from '@/config'

const showModal = ref(false);
definePageMeta(
    {
        layout: 'admin',
    }
)

const closeModal = () => {
    showModal.value = false;
}

//Save

const name = ref('');
const remark = ref('');
const id = ref('');
const price = ref('');
const productTypes = ref([]);

onMounted(async () => {
    await fetchData();
});

const fetchData = async () => {
    try {
        const res = await axios.get(config.apiServer + '/api/productType/list');
        productTypes.value = res.data.results;

    } catch (e) {
        Swal.fire({
            title: 'Error!',
            text: e.message,
            icon: 'error'
        })
    }
}

const save = async () => {
    try {
        const payload = {
            name: name.value,
            remark: remark.value,
        }
        if(id.value===''){
        const res = await axios.post(config.apiServer + '/api/productType/create', payload);
        }else{
        const res = await axios.put(config.apiServer + '/api/productType/update/' + id.value, payload);
        id.value='';
        }
        //console.log('response', response.data.msg);
        //if (res.data.msg=== "ok") { // Laravel API
        // if (res.data.message === 'success') {
        //     Swal.fire({
        //         icon: 'success',
        //         title: 'เพิ่มประเภทสินค้าสำเร็จ',
        //         text: 'ประเภทสินค้าถูกบันทึกเรียบร้อยแล้ว'
        //     });
            await fetchData();
            closeModal();
        //}
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'เพิ่มประเภทสินค้าไม่สำเร็จ',
            text: e.message,
        });
    }
}

const update = (productType) => {
    id.value = productType.id;
    name.value = productType.name;
    remark.value = productType.remark;
    showModal.value = true;
}

const remove = async (id) => {
    try {
        const button = await Swal.fire({
            title: 'ยืนยันการลบ',
            text: 'ต้องการลบประเภทสินค้านี้หรือไม่',
            showCancelButton: true,
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
        })
        if(button.isConfirmed){
            await axios.delete(config.apiServer + '/api/productType/remove/'+id);
            await fetchData();
        }
    }catch (e){
        Swal.fire({
            icon: 'error',
            title:'error',
            text:e.message
        })

    }
}

</script>


<template>
    <div>ประเภทสินค้า</div>
    <div class="mt-3">
        <button class="btn btn-primary" @click="showModal = true">
            <i class="fa fa-plus"></i>
            เพิ่มประเภทสินค้า
        </button>
        <table class="table table-bordered mt-3">
            <thead class="bg-primary text-white">
                <tr>
                    <th>ชื่อ</th>
                    <th>หมายเหตุ</th>
                    <th width="110px"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="productType in productTypes" :key="productType.id">
                    <td>{{ productType.name }}</td>
                    <td>{{ productType.remark }}</td>
                    <td class="text-center">
                        <button class="btn btn-primary me-1" @click="update(productType)">
                            <i class="fa fa-pencil"></i>
                        </button>
                        <button class="btn btn-danger me-1" @click="remove(productType.id)">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <Modal v-if="showModal" title="เพิ่มประเภทสินค้า" @close="closeModal">
        <div>ชื่อ</div>
        <input type="text" class="form-control" v-model="name" />

        <div class="mt-3"> หมายเหตุ</div>
        <input type="text" class="form-control" v-model="remark" />

        <button class="btn btn-primary mt-3" @click="save">
            <i class="fa fa-check me-2"></i>
            บันทึก
        </button>

    </Modal>
</template>