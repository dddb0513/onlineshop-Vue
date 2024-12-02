import Vue from 'vue';
import Router from 'vue-router';
import FrontPage from '../views/FrontPage.vue'; // 导入页面组件
import LogIn from '../views/LogIn.vue';
import RegisterIn from '../views/RegisterIn.vue';
import ShopCart from '../views/ShopCart.vue';
import UserOrder from '../views/UserOrder.vue';
import ProductDetail from '../views/ProductDetail.vue';
import OrderManagement from '../views/OrderManagement.vue';
import ProductManagement from '../views/ProductManagement.vue'
import AddProduct from '../views/AddProduct.vue'
import UserManagement from '../views/UserManagement.vue'
import UserRecords from '../views/UserRecords.vue'

Vue.use(Router);

export default new Router({
  mode: 'history', // 使用 HTML5 History 模式
  routes: [
    {
      path: '/',
      redirect: '/frontpage'  // 重定向
    },
    {
      path: '/frontpage',
      name: 'frontpage',
      component: FrontPage  // 指定页面组件
    },
    {
      path: '/LogIn',
      name: 'LogIn',
      component: LogIn  // 指定页面组件
    },
    {
      path: '/RegisterIn',
      name: 'RegisterIn',
      component: RegisterIn
    },
    {
      path: '/ShopCart',
      name: 'ShopCart',
      component: ShopCart  // 指定页面组件
    },
    {
      path: '/UserOrder',
      name: 'UserOrder',
      component: UserOrder
    },
    {
      path:'/OrderManagement',
      name:'OrderManagement',
      component:OrderManagement
    },
    {
      path:'/ProductManagement',
      name:'ProductManagement',
      component:ProductManagement
    },
    {
      path: '/product/:id', // 使用动态路由参数
      name: 'ProductDetail',
      component: ProductDetail,
    },
    {
      path:'/AddProduct',
      name:'AddProduct',
      component:AddProduct
    },
    {
      path: '/UserManagement',
      name: 'UserManagement',
      component: UserManagement
    },
    {
      path: '/UserRecords',
      name: 'UserRecords',
      component: UserRecords
    }
    
  ]
});

