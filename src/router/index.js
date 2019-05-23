import Vue from 'vue'
import Router from 'vue-router'
import BlogEdit from '@/components/BlogEdit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'BlogEdit',
      component: BlogEdit
    }
  ]
})
