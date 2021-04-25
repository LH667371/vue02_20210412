import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Course from "../components/Course";
import Detail from "../components/Detail";
import Cart from "../components/Cart";
import Order from "../components/Order";
import OrderList from "../components/OrderList";
import OrderSuccess from "../components/OrderSuccess";

Vue.use(Router)

export default new Router({
    mode: "history",
    routes: [
        {path: "/home", component: Home},
        {path: "/login", component: Login},
        {path: "/register", component: Register},
        {path: "/course/:category", component: Course},
        {path: "/detail/:id", component: Detail},
        {path: "/cart", component: Cart},
        {path: "/order", component: Order},
        {path: "/order_list", component: OrderList},
        {path: "/result", component: OrderSuccess},
        {path: "/", redirect: "/home"},
        {path: "/*", redirect: "/home"},
    ]
})
