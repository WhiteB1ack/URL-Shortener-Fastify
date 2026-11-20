<script setup lang="ts">
import { ref } from 'vue';
import { createShortUrl } from '../api/shortener';

const longUrl = ref<string>('');
const custmeCode = ref<string>('');

const handleCreateShorturl = async () => {
  const url = longUrl.value.trim();
  const code = custmeCode.value.trim();
  // 提交数据
  
  const data = {
    url, 
    ...(code ? { code } : {}) 
  }

  try {
    // 尝试进行前后端连接
        
    const res = await createShortUrl(data)
    console.log('创建成功', res)

    // 成功将数据储存在本地存储中
  } catch (err) {
    console.log('创建失败', err)
  }
}

</script>

<template>
  <h3>短链生成板</h3>
  <div>
    <span>
      原链接: <input type="text" v-model="longUrl" /> <br>
      可选短码: <input type="text" v-model="custmeCode" /> <br>
      <button @click="handleCreateShorturl">提交</button>
    </span>
  </div>

</template>


<style scoped>


</style>