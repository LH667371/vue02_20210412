<template>
    <div class="header-box">
        <div class="header">
            <div class="content">
                <div class="logo full-left">
                    <router-link to="/"><img src="/static/image/logo.png" alt=""></router-link>
                </div>
                <ul class="nav full-left" v-for="(value, index) in header_list" :key="index">
                    <li v-if="value['is_site']"><a :href="value['link']" target="_blank"><span>{{
                            value['title']
                        }}</span></a></li>
                    <li v-else>
                        <router-link :to="value['link']"><span>{{ value['title'] }}</span></router-link>
                    </li>
                </ul>
                <div class="login-bar full-right">
                    <div class="shop-cart full-left">
                        <span @click="to_cart">
                                <img src="/static/image/cart.svg" alt="">
                                <span style="color: blue">{{ $store.state.cart_length }}</span>
                                购物车
                        </span>
                    </div>
                    <div class="login-box full-left" v-show="!login_status">
                        <span><router-link to="/login">登录</router-link></span>
                        &nbsp;|&nbsp;
                        <span><router-link to="/register">注册</router-link></span>
                    </div>
                    <div class="login-box full-left" v-show="login_status">
                        欢迎
                        <el-link type="primary">{{ username }}</el-link>
                        登录！
                        <router-link to="/order_list"><span>我的订单</span></router-link>
                        &nbsp;|&nbsp;
                        <el-popconfirm title="确定退出登录吗？" @confirm="log_off">
                            <span slot="reference">退出登录</span>
                        </el-popconfirm>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            header_list: [],
            username: '',
            login_status: false,
        }
    },
    created() {
        this.get_header_list();
        if (sessionStorage.token) {
            this.login_status = true;
            this.username = sessionStorage.username;
            this.get_cart_length();
        }
    },
    methods: {
        get_cart_length() {
            this.$axios.get(this.$settings.HOST + "cart/option/", {
                headers: {
                    // 由于此视图需要认证，所以需要携带token
                    "Authorization": "auth " + sessionStorage.token,
                },
            }).then(res => {
                // console.log(res.data);
                this.$store.commit("change_count", res.data.length === 0 ? '' : res.data.length);
            }).catch(error => {
                console.log(error);
            })
        },
        to_cart() {
            if (!sessionStorage.token) {
                this.$confirm("请登录后再查看购物车，点击确认可前往登录！").then(() => {
                    this.$router.push('/login');
                })
                return false;
            } else
                this.$router.push('/cart');
        },
        get_header_list() {
            this.$axios({
                url: this.$settings.HOST + 'home/header/',
                method: 'get',
            }).then(res => {
                this.header_list = res.data;
            }).catch(error => {
                console.log(error);
            })
        },
        log_off() {
            this.$store.commit('change_username', '');
            this.$store.commit('change_count', '');
            this.login_status = false;
            if (this.$route.fullPath === '/cart')
                this.$router.push('/');
            sessionStorage.clear();
        },
    },
}
</script>

<style scoped>
.header-box {
    height: 80px;
}

.header {
    width: 100%;
    height: 80px;
    box-shadow: 0 0.5px 0.5px 0 #c9c9c9;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 99;
    background: #fff;
}

.header .content {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
}

.header .content .logo {
    height: 80px;
    line-height: 80px;
    margin-right: 50px;
    cursor: pointer; /* 设置光标的形状为爪子 */
}

.header .content .logo img {
    vertical-align: middle;
}

.header .nav li {
    float: left;
    padding-top: 5px;
    height: 80px;
    line-height: 80px;
    margin-right: 30px;
    font-size: 16px;
    color: #4a4a4a;
    cursor: pointer;
}

.header .nav li span {
    padding-bottom: 16px;
    padding-left: 5px;
    padding-right: 5px;
}

.header .nav li span a {
    display: inline-block;
}

.header .nav li .this {
    color: #4a4a4a;
    border-bottom: 4px solid #ffc210;
}

.header .nav li:hover span {
    color: #ffc210;
}

.header .login-bar {
    height: 80px;
}

.header .login-bar .shop-cart {
    margin-right: 20px;
    border-radius: 17px;
    background: #f7f7f7;
    cursor: pointer;
    font-size: 14px;
    height: 30px;
    width: 100px;
    margin-top: 30px;
    line-height: 30px;
    text-align: center;
}

.header .login-bar .shop-cart:hover {
    background: #f0f0f0;
}

.header .login-bar .shop-cart img {
    width: 15px;
    margin-right: 4px;
    margin-left: 6px;
}

.header .login-bar .shop-cart span {
    margin-right: 6px;
}

.header .login-bar .login-box {
    margin-top: 33px;
}

.header .login-bar .login-box span {
    color: #4a4a4a;
    cursor: pointer;
}

.header .login-bar .login-box span:hover {
    color: #ffc210;
}

a {
    text-decoration: none;
    color: #333;
}

.member {
    display: inline-block;
    height: 34px;
    margin-left: 20px;
}

.member img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: inline-block;
}

.member img:hover {
    border: 1px solid yellow;
}

.header .login-bar .login-box1 {
    margin-top: 16px;
}

a:hover {
    display: inline-block;
}
</style>
