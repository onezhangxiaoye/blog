import Vue from 'vue'
import Router from 'vue-router'
import BlogEdit from '@/components/BlogEdit'
import Blogs from '@/components/Blogs'
import Home from '@/components/Home'
import Index from '@/components/Index'
import Blog from '@/components/Blog'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {
          path: '/',
          name: 'Home',
          component: Home
        },
        {
          path: '/Blog/:blogId',
          name: 'Blog',
          component: Blog
        },
        {
          path: '/BlogEdit',
          name: 'BlogEdit',
          component: BlogEdit
        },
      ]
    },
  ]
})
