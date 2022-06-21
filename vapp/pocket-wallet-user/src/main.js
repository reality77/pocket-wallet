import { createApp } from 'vue'
import App from './App.vue'
import store from './store/index.js'                // FOR RUNTIME
//import store from './store/index_sample.js'       // FOR DESIGN ONLY
import './index.css'
import './assets/line-awesome/css/line-awesome.min.css';

createApp(App).use(store).mount('#app')
