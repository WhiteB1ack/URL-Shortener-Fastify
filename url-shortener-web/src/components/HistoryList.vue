<script lang="ts" setup>
import type { CreateUrlStatsResponse } from '../types/shortener';
import { getAllShortUrlList } from '../api/shortener';
import { onMounted, ref } from 'vue';

const backendBase = import.meta.env.VITE_BACKEND_BASE_URL
const allShortUrlList = ref<CreateUrlStatsResponse[]>([])

const handleCreateShorturl = async () => {
  try {
    const res = await getAllShortUrlList()
    allShortUrlList.value = res.data.list
  } catch(err) {
    console.log('创建失败', err)
  }
}

onMounted(() => {
  handleCreateShorturl();
})
</script>

<template>
  <table border="1" cellspacing="0" cellpadding="8">
    <thead>
      <tr>
        <th>costume</th>
        <th>LongUrl</th>
        <th>clicls</th>
        <th>CreatedAt</th>
        <th>Links</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in allShortUrlList">
        <td><a :href="`detail/${item.code}`">{{ item.code }}</a></td>
        <td>{{ item.longUrl }}</td>
        <td>{{ item.clicks }}</td>
        <td>{{ item.createdAt }}</td>
        <td><a
          :href="`${backendBase}/${item.code}`" target="_blank" rel="noopener noreferrer">
          http://localhost:3000/{{ item.code }}
        </a></td>
      </tr>
    </tbody>
  </table>
  <br><br>
  <a href="/">home</a>
</template>

<style>

</style>