import Vue from 'vue'
import Router from 'vue-router'
import {routes} from './routes'
import VCharts from 'v-charts'
import 'echarts/lib/component/dataZoom'

Vue.use(Router)
Vue.use(VCharts)
const router = new Router({
  routes
})

router.afterEach(route => {
  window.document.title = route.meta.title
})
export default router


