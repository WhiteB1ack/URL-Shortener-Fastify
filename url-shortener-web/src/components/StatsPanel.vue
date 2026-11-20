<script setup lang="ts">
import { ref } from 'vue'
import { getShortUrl } from '../api/shortener';
import type { CreateUrlStatsResponse } from '../types/shortener';
const costmeCode = ref<string>('')

const isShow = ref(false)
const urlDetail = ref<CreateUrlStatsResponse | null>(null);

const handleGetShorturl = async() => {
  // 提交数据

  // 检测数据内容是否合规

  try {
    const res = await getShortUrl(costmeCode.value)
    console.log(res)
    isShow.value = true
    urlDetail.value = res.data
  } catch (err) {
    console.log('查询失败', err)
  }
}
</script>

<template>
  <h3>短链查询板</h3>
  <div>
    <span>
      查询短码: <input type="text", v-model="costmeCode" /><br>
      <button @click="handleGetShorturl">提交</button>
    </span>
  </div>
  <h3>结果面板</h3>
  <div>
    <span v-if="isShow">
      <h5>code: {{ urlDetail!.code }}</h5>
      <h5>longUrl: {{ urlDetail!.longUrl }}</h5>
      <h5>clicks: {{ urlDetail!.clicks }}</h5>
      <h5>createAt: {{ urlDetail!.createdAt }}</h5>
    </span>
    <span v-else>
      <h5>404 Not Found</h5>
      <h6>未接收到数据</h6>
    </span>
  </div>
</template>