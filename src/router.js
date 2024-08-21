import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue' // Ajusta esta ruta según la ubicación de tu archivo router.js
import ListApartment from './views/ListApartment.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/list-apartment', component: ListApartment },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
