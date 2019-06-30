// import Vue from 'vue'
// import VueRouter from 'vue-router'
import BlogEdit from '@/components/BlogEdit'
import Blogs from '@/components/Blogs'
import Index from '@/components/Index'
import Blog from '@/components/Blog'

// Vue.use(Router)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {
          path: '/',
          name: 'Blogs',
          component: Blogs
        },
        {
          path: '/Blog/:blogId',
          name: 'Blog',
          component: Blog
        },
      ]
    },
    {
      path: '/BlogEdit',
      name: 'BlogEdit',
      component: BlogEdit
    },
  ]
})
