<template>
    <div class="user-order">
        <Header/>
        <div class="main">
            <div class="banner">
                <div class="avatar"><img class="newImg" alt="" src="../../static/image/logo.png"></div>
            </div>
            <div class="profile">
                <div class="profile-info">
                    <span class="user-name">Mixtea</span>
                    <span class="user-job">北京市 | Python</span>
                </div>
                <ul class="my-item">
                    <li>我的账户</li>
                    <li class="active">我的订单</li>
                    <li>个人资料</li>
                    <li>账号安全</li>
                </ul>
            </div>
            <div class="user-data">
                <ul class="nav">
                    <li class="order-info">订单</li>
                    <li class="course-expire">有效期</li>
                    <li class="course-price">课程价格</li>
                    <li class="real-price">实付金额</li>
                    <li class="order-status">交易状态</li>
                    <li class="order-do">交易操作</li>
                </ul>
                <div class="my-order-item" v-for="(order, key) in order_list" :key="key">
                    <div class="user-data-header">
                        <span class="order-time">{{ show_time(order.create_time) }}</span>
                        <span class="order-num">订单号：
                                    <span class="my-older-number">{{ order.order_number }}</span>
                                </span>
                    </div>
                    <ul class="nav user-data-list" v-for="(value, index) in order.order_detail" :key="index">
                        <li class="order-info">
                            <img :src="$settings.HOST+'/media/'+value.course_img" alt="">
                            <div class="order-info-title">
                                <p class="course-title">{{ value.name }}</p>
                                <p class="price-service" v-show="value.discount_name">{{
                                        value.discount_name
                                    }}</p>
                            </div>
                        </li>
                        <li class="course-expire">{{ value.expire }}</li>
                        <li class="course-price">{{ value.price }}</li>
                        <li class="real-price">{{ value.real_price }}</li>
                        <li class="order-status" v-if="order.status === '已支付'">交易成功</li>
                        <li class="order-status" v-else>{{ order.status }}</li>
                        <li class="order-do">
                            <span class="btn" v-if="order.status === '已支付'">去学习</span>
                            <span class="btn2" v-if="order.status === '未支付'"
                                  v-show="index === order.order_detail.length-1"
                                  @click="go_pay(order.order_number)">去支付</span>
                            <el-popconfirm title="确定取消该订单吗？" @confirm="cancel(order.id, key)">
                                <span class="btn3" v-if="order.status === '未支付'"
                                      v-show="index === order.order_detail.length-1"
                                      slot="reference">取消</span>
                            </el-popconfirm>
                        </li>
                    </ul>
                    <hr>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
</template>

<script>
import Footer from "./common/Footer";
import Header from "./common/Header";
import {formatDate} from "../utils/date";

export default {
    name: "OrderList",
    components: {
        Footer,
        Header,
    },
    data() {
        return {
            order_list: {},
        }
    },
    created() {
        this.check_user_login();
    },
    methods: {
        check_user_login() {
            if (!sessionStorage.token) {
                this.$confirm("请登录后再查看我的订单，点击确认可前往登录！").then(() => {
                    this.$router.push('/login');
                })
                return false;
            }
            this.get_order_list();
        },
        get_order_list() {
            this.$axios.get(this.$settings.HOST + 'order/get_option/', {
                params: {
                    user: sessionStorage.user_id
                },
                headers: {
                    "Authorization": "auth " + sessionStorage.token,
                }
            }).then(res => {
                // console.log(res);
                this.order_list = res.data;
            }).catch(error => {
                console.log(error);
                try {
                    if (error.response.data.detail === "Signature has expired.")
                        this.$confirm("登录已过期，请重新登录，点击确认可前往登录！").then(() => {
                            this.$store.commit('change_username', '');
                            this.$store.commit('change_count', '');
                            sessionStorage.clear();
                            this.$router.push('/login');
                        })
                } catch (a) {
                }
            })
        },
        show_time(val) {
            return formatDate({date: val, formatStr: 'yyyy-MM-dd HH:mm:ss'})
        },
        go_pay(order_number) {
            this.$axios.get(this.$settings.HOST + "payments/pay/", {
                params: {
                    order_number: order_number
                },
                headers: {
                    "Authorization": "auth " + sessionStorage.token,
                }
            }).then(res => {
                // 成功则返回一个支付链接
                location.href = res.data;
            }).catch(error => {
                // 链接生成失败
                // console.log(error.response);
                if (error.response.status === 402)
                    this.$message.error(error.response.data.message)
                try {
                    if (error.response.data.detail === "Signature has expired.")
                        this.$confirm("登录已过期，请重新登录，点击确认可前往登录！").then(() => {
                            this.$store.commit('change_username', '');
                            this.$store.commit('change_count', '');
                            sessionStorage.clear();
                            this.$router.push('/login');
                        })
                } catch (a) {
                }
            })
        },
        cancel(id, index) {
            console.log(index);
            this.$axios.patch(this.$settings.HOST + "order/cancel_option/" + id + '/', {
                order_status: 2
            }, {
                headers: {
                    "Authorization": "auth " + sessionStorage.token,
                }
            }).then(res => {
                console.log(res);
                this.order_list[index].status = '已取消';
            }).catch(error => {
                // console.log(error.response);
                try {
                    if (error.response.data.detail === "Signature has expired.")
                        this.$confirm("登录已过期，请重新登录，点击确认可前往登录！").then(() => {
                            this.$store.commit('change_username', '');
                            this.$store.commit('change_count', '');
                            sessionStorage.clear();
                            this.$router.push('/login');
                        })
                } catch (a) {
                }
            })
        }
    }
}
</script>

<style scoped>
.user-order {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
}

.main {
    flex: 1;
    background-color: #eeeeee;
}

.banner {
    width: 100%;
    height: 200px;
    background-size: cover;
    float: top;
    background: url(../../static/image/background.jpg) no-repeat 0 -250px;
    z-index: 1;
}

.profile {
    width: 1200px;
    margin: 0 auto;
}

.profile-info {
    text-align: center;
}

.avatar {
    padding-top: 100px;
    width: 50px;
    height: 150px;
    padding-left: 8px;
    border-radius: 60px;
    overflow: hidden;
    margin: 0 auto;
}

.user-name {
    display: block;
    font-size: 24px;
    color: #4a4a4a;
}

.user-job {
    display: block;
    font-size: 11px;
    color: #9b9b9b;
}

.my-item {
    list-style: none;
    line-height: 1.42857143;
    color: #333;
    width: 474px;
    height: 31px;
    display: -ms-flexbox;
    display: flex;
    cursor: pointer;
    margin: 41px auto 0;
    -ms-flex-pack: justify;
    justify-content: space-between;
}

.my-item .active {
    border-bottom: 1px solid #000;
}

.user-data {
    width: 1200px;
    height: auto;
    padding-top: 30px;
    border-top: 1px solid #e8e8e8;
    margin: 0 auto 63px;
}

.user-data hr {
    border: solid 1px #e9e9e9;
    height: 0;
}

.nav {
    width: 100%;
    height: 60px;
    background: #e9e9e9;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
}

.nav li {
    margin-left: 20px;
    margin-right: 28px;
    height: 60px;
    line-height: 60px;
    list-style: none;
    font-size: 13px;
    color: #333;
    width: 160px;
}

.nav .order-info {
    width: 370px;
}

.nav .course-expire {
    width: 80px;
    text-align: center;
}

.nav .course-price {
    width: 110px;
    text-align: center;
}

.nav .real-price {
    text-align: center;
}

.nav .order-status {
    text-align: center;
}

.nav .order-do {
    text-align: center;
}

.user-data-header {
    display: flex;
    height: 44px;
    color: #4a4a4a;
    font-size: 14px;
    background: #f3f3f3;
    -ms-flex-align: center;
    align-items: center;
}

.order-time {
    font-size: 12px;
    display: inline-block;
    margin-left: 20px;
}

.order-num {
    font-size: 12px;
    display: inline-block;
    margin-left: 29px;
}

.user-data-list {
    height: 100%;
    display: flex;
}

.user-data-list {
    background: none;
}

.user-data-list li {
    height: 60px;
    line-height: 60px;
}

.user-data-list .order-info {
    display: flex;
    align-items: center;
    margin-right: 28px;
}

.user-data-list .order-info img {
    max-width: 100px;
    max-height: 75px;
    margin-right: 22px;
}

.course-title {
    width: 203px;
    font-size: 13px;
    color: #333;
    line-height: 20px;
    margin-top: -10px;
}

.order-info-title .price-service {
    line-height: 18px;
}

.price-service {
    font-size: 12px;
    color: #fa6240;
    padding: 0 5px;
    border: 1px solid #fa6240;
    border-radius: 4px;
    margin-top: 4px;
    position: absolute;
}

.order-info-title {
    margin-top: -10px;
}

.user-data-list .course-expire {
    font-size: 12px;
    color: #ff5502;
    width: 80px;
    text-align: center;
}

.btn {
    width: 95px;
    height: 32px;
    font-size: 14px;
    color: #fff;
    background: #ffc210;
    border-radius: 4px;
    border: none;
    outline: none;
    transition: all .25s ease;
    display: inline-block;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
}

.btn2 {
    width: 50px;
    height: 32px;
    font-size: 14px;
    color: #fff;
    background: #ffc210;
    border-radius: 4px;
    border: none;
    outline: none;
    transition: all .25s ease;
    display: inline-block;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
}

.btn3 {
    width: 40px;
    height: 32px;
    font-size: 12px;
    color: #fff;
    background: #aaaaaa;
    border-radius: 4px;
    border: none;
    outline: none;
    transition: all .25s ease;
    display: inline-block;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
}
</style>
