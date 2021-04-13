import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home";
import login from "../components/login";

Vue.use(Router)

export default new Router({
    routes: [
        {path: "/home", component: Home},
        {path: "/login", component: login},
        {path: "/", redirect: "/home"},
        {path: "/*", redirect: "/home"},
    ]
})
