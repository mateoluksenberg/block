import { createApp } from 'vue'
import App from './App.vue'

// Import Bootstrap and BootstrapVue CSS files
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

// Import BootstrapVue 3
import { BootstrapVue3 } from 'bootstrap-vue-3'

// Importa el router
import router from './router'

// Crea la app
const app = createApp(App)

// Usa BootstrapVue 3
app.use(BootstrapVue3)

// Usa el router
app.use(router)

// Monta la app
app.mount('#app')
