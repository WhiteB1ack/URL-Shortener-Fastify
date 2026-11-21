import { createRouter, createWebHistory } from "vue-router";

import HistoryList from "../components/HistoryList.vue";
import ShortenForm from "../components/ShortenForm.vue";
import StatsPanel from "../components/StatsPanel.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      component: ShortenForm,
    },
    {
      path: '/list',
      component: HistoryList
    },
    {
      path: '/detail/:code',
      component: StatsPanel
    }
  ]
})

export default router