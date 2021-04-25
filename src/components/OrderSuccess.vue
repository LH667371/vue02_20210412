<template>
    <div class="success">
        <Header/>
        <div class="main">
            <div class="title">
                <!--          <img src="../../static/images/right.svg" alt="">-->
                <div class="success-tips">
                    <p class="tips1">您已成功购买 {{ course_list.length }} 门课程！</p>
                    <p class="tips2">你还可以加入QQ群 <span>11111111</span> 学习交流</p>
                </div>
            </div>
            <div class="order-info">
                <p class="info1"><b>付款时间：</b><span>{{ pay_time }}</span></p>
                <p class="info2"><b>付款金额：</b><span>￥{{ price }}元</span></p>
                <p class="info3"><b>课程信息：</b><span style="font-size: 12px"
                                                   v-for="course in course_list">{{ course.course_name }}<br>有效期：{{ show_time(course.start_time) + '——' + show_time(course.end_time) }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br></span>
                </p>
            </div>
            <div class="wechat-code">
            </div>
            <div class="study">
                <router-link to="/order_list"><span>立即学习</span></router-link>
            </div>
        </div>
        <Footer/>
    </div>
</template>

<script>
import Footer from "./common/Footer";
import Header from "./common/Header";
import {formatDate} from '../utils/date.js';

export default {
    name: "OrderSuccess",
    components: {
        Footer,
        Header,
    },
    data() {
        return {
            course_list: [],
            pay_time: '',
            price: 0,
        }
    },
    created() {
        this.check_user_login();
        this.PayResult();
    },
    methods: {
        PayResult() {
            this.$axios.get(this.$settings.HOST + "payments/result/" + location.search, {
                headers: {
                    "Authorization": "auth " + sessionStorage.token,
                }
            }).then(res => {
                // console.log(res.data);
                this.pay_time = formatDate({date: res.data.pay_time, formatStr: 'yyyy-MM-dd HH:mm:ss'});
                this.price = res.data.real_price;
                this.course_list = res.data.course_list;
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
                this.$confirm(error.response.data.message).then(() => {
                    this.$router.push('/order_list');
                }).catch(() => {
                    this.$router.push('/order_list');
                })
            })
        },
        check_user_login() {
            if (!sessionStorage.token) {
                this.$confirm("请登录后再查看此页面，点击确认可前往登录！").then(() => {
                    this.$router.push('/login');
                })
                return false;
            }
        },
        show_time(val) {
            return formatDate({date: val, formatStr: 'yyyy-MM-dd HH:mm:ss'})
        },
    }
}
</script>

<style scoped>
.success {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
}

.main {
    flex: 1;
    height: 100%;
    padding-top: 105px;
    padding-bottom: 25px;
    margin: 0 auto;
    width: 1200px;
    background: #fff;
}

.main .title {
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    padding: 25px 40px;
    border-bottom: 1px solid #f2f2f2;
}

.main .title .success-tips {
    box-sizing: border-box;
}

.title img {
    vertical-align: middle;
    width: 60px;
    height: 60px;
    margin-right: 40px;
}

.title .success-tips {
    box-sizing: border-box;
}

.title .tips1 {
    font-size: 22px;
    color: #000;
}

.title .tips2 {
    font-size: 16px;
    color: #4a4a4a;
    letter-spacing: 0;
    text-align: center;
    margin-top: 10px;
}

.title .tips2 span {
    color: #ec6730;
}

.order-info {
    padding: 25px 48px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f2f2f2;
}

.order-info p {
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 10px;
    font-size: 16px;
}

.order-info p b {
    font-weight: 400;
    color: #9d9d9d;
    white-space: nowrap;
}

.wechat-code {
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    padding: 25px 40px;
    border-bottom: 1px solid #f2f2f2;
}

.wechat-code > img {
    width: 100px;
    height: 100px;
    margin-right: 15px;
}

.wechat-code p {
    font-size: 14px;
    color: #d0021b;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
}

.wechat-code p > img {
    width: 16px;
    height: 16px;
    margin-right: 10px;
}

.study {
    padding: 25px 40px;
}

.study span {
    display: block;
    width: 140px;
    height: 42px;
    text-align: center;
    line-height: 42px;
    cursor: pointer;
    background: #ffc210;
    border-radius: 6px;
    font-size: 16px;
    color: #fff;
}
</style>
