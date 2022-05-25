import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import NProgress from 'nprogress'
import VueQuillEditor from 'vue-quill-editor'
import TreeTable from 'vue-table-with-tree-grid'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor /* { default global options } */)
Vue.config.productionTip = false
Vue.prototype.$ELEMENT = {
  size: 'small',
  zIndex: 3000
}
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
