<template>
    <div class="cart">
        <Header/>
        <div class="cart-info">
            <h3 class="cart-top">购物车结算 <span>共{{ $store.state.select_id.length }}门课程</span></h3>
            <div class="cart-title">
                <el-row>
                    <el-col :span="4">&nbsp;</el-col>
                    <el-col :span="9">课程</el-col>
                    <el-col :span="8">有效期</el-col>
                    <el-col :span="1">价格</el-col>
                </el-row>
            </div>
            <div class="cart-item" v-for="(value, index) in course_list">
                <el-row>
                    <el-col :span="2" class="checkbox">&nbsp;&nbsp;</el-col>
                    <el-col :span="11" class="course-info">
                        <img :src="$settings.HOST + value.image" alt="">
                        <span>{{ value.name }}</span>
                    </el-col>
                    <el-col :span="8"><span>{{ value.expire_text }}</span></el-col>
                    <el-col :span="3">¥{{ parseFloat(value.expire_price).toFixed(2) }}</el-col>
                </el-row>
                <hr>
            </div>
            <div class="calc">
                <el-row class="pay-row">
                    <el-col :span="4" class="pay-col"><span class="pay-text">支付方式：</span></el-col>
                    <el-col :span="8">
                        <span class="alipay"><img src="../../static/image/alipay2.png" alt=""></span>
                        <span class="alipay wechat"><img src="" alt=""></span>
                    </el-col>
                    <el-col :span="8" class="count">实付款： <span>¥{{ parseFloat(total_price).toFixed(2) }}</span></el-col>
                    <el-col :span="4" class="cart-pay"><span @click="create_order">支付宝支付</span></el-col>
                </el-row>
            </div>
        </div>
        <Footer/>
    </div>
</template>

<script>
import CartItem from "./CartItem";
import Footer from "./common/Footer";
import Header from "./common/Header";

export default {
    name: "Order",
    components: {
        CartItem,
        Footer,
        Header,
    },
    data() {
        return {
            course_list: [],
            total_price: 0,
            pay_type: 1,
        }
    },
    created() {
        this.get_select_course();
    },
    methods: {
        // 获取购物车中勾选的课程
        get_select_course() {
            this.$axios.get(this.$settings.HOST + "cart/order/", {
                headers: {
                    "Authorization": "auth " + sessionStorage.token,
                }
            }).then(res => {
                // console.log(res);
                this.course_list = res.data.course_list;
                this.total_price = res.data.total_price;
                if (this.course_list.length === 0) {
                    this.$message.error('没有加购商品，无法生成订单！');
                    this.$router.go(-1);
                }
            }).catch(error => {
                console.log(error);
                if (error.response.data.detail === "Signature has expired.")
                    this.$confirm("登录已过期，请重新登录，点击确认可前往登录！").then(() => {
                        this.$store.commit('change_username', '');
                        this.$store.commit('change_count', '');
                        sessionStorage.clear();
                        this.$router.push('/login');
                    })
            })
        },
        // 生成订单
        create_order() {
            if (this.course_list.length !== 0)
                this.$axios.post(this.$settings.HOST + "order/option/", {
                    pay_type: this.pay_type,
                }, {
                    headers: {
                        "Authorization": "auth " + sessionStorage.token,
                    }
                }).then(res => {
                    console.log(res.data);
                    this.$message.success("订单生成成功，即将跳转到支付页面~");
                    this.get_cart_length();
                    // 调用方法，开始支付
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
            else {
                this.$message.error('没有加购商品，无法生成订单！');
                this.$router.go(-1);
            }
        },
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
    }
}
</script>

<style scoped>
.cart {
    /*margin-top: 80px;*/
    display: flex;
    min-height: 100vh;
    flex-direction: column;
}

.cart-info {
    overflow: hidden;
    width: 1200px;
    margin: 0 auto 0;
    flex: 1;
}

.cart-top {
    font-size: 18px;
    color: #666;
    margin: 25px 0;
    font-weight: normal;
}

.cart-top span {
    font-size: 12px;
    color: #d0d0d0;
    display: inline-block;
}

.cart-title {
    background: #F7F7F7;
    height: 70px;
    line-height: 70px;
}

.calc {
    margin-top: 25px;
    margin-bottom: 40px;
}

.calc .count {
    text-align: right;
    margin-right: 10px;
    vertical-align: middle;
}

.calc .count span {
    font-size: 36px;
    color: #333;
}

.calc .cart-pay {
    margin-top: 5px;
    width: 110px;
    height: 38px;
    outline: none;
    border: none;
    color: #fff;
    line-height: 38px;
    background: #ffc210;
    border-radius: 4px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
}

.cart-item {
    height: 120px;
    line-height: 120px;
    margin-bottom: 30px;
}

.cart-item hr {
    border: solid 1px #F7F7F7;
    height: 0;
    margin-top: 15px;
}

.course-info img {
    width: 175px;
    height: 115px;
    margin-right: 35px;
    vertical-align: middle;
}

.alipay {
    display: inline-block;
    height: 48px;
}

.alipay img {
    height: 100%;
    width: auto;
}

.pay-text {
    display: block;
    text-align: right;
    height: 100%;
    line-height: 100%;
    vertical-align: middle;
    margin-top: 20px;
}

.course_name, .real_price, .original_price {
    display: inline-block;
    line-height: 140%;
}

.course_name .discount {
    color: #ffc210;
}

.original_price {
    color: #9b9b9b;
}

.course-price {
    line-height: 32px;
}

/*优惠券相关的样式*/
.coupon-box {
    text-align: left;
    padding-bottom: 22px;
    padding-left: 30px;
    border-bottom: 1px solid #e8e8e8;
}

.coupon-box::after {
    content: "";
    display: block;
    clear: both;
}

.icon-box {
    float: left;
}

.icon-box .select-coupon {
    float: left;
    color: #666;
    font-size: 16px;
}

.icon-box::after {
    content: "";
    clear: both;
    display: block;
}

.select-icon {
    width: 20px;
    height: 20px;
    float: left;
}

.select-icon img {
    max-height: 100%;
    max-width: 100%;
    margin-top: 2px;
    transform: rotate(-90deg);
    transition: transform .5s;
}

.is_show_select {
    transform: rotate(0deg) !important;
}

.coupon-num {
    height: 22px;
    line-height: 22px;
    padding: 0 5px;
    text-align: center;
    font-size: 12px;
    float: left;
    color: #fff;
    letter-spacing: .27px;
    background: #fa6240;
    border-radius: 2px;
    margin-left: 20px;
}

.sum-price-wrap {
    float: right;
    font-size: 16px;
    color: #4a4a4a;
    margin-right: 45px;
}

.sum-price-wrap .sum-price {
    font-size: 18px;
    color: #fa6240;
}

.no-coupon {
    text-align: center;
    width: 100%;
    padding: 50px 0px;
    align-items: center;
    justify-content: center; /* 文本两端对其 */
    border-bottom: 1px solid rgb(232, 232, 232);
}

.no-coupon-tips {
    font-size: 16px;
    color: #9b9b9b;
}

.credit-box {
    height: 30px;
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end
}

.my_el_check_box {
    position: relative;
}

.my_el_checkbox {
    margin-right: 10px;
    width: 16px;
    height: 16px;
}

.discount {
    overflow: hidden;
}

.discount-num1 {
    color: #9b9b9b;
    font-size: 16px;
    margin-right: 45px;
}

.discount-num2 {
    margin-right: 45px;
    font-size: 16px;
    color: #4a4a4a;
}

.sun-coupon-num {
    margin-right: 45px;
    margin-bottom: 43px;
    margin-top: 40px;
    font-size: 16px;
    color: #4a4a4a;
    display: inline-block;
    float: right;
}

.sun-coupon-num span {
    font-size: 18px;
    color: #fa6240;
}

.coupon-list {
    margin: 20px 0;
}

.coupon-list::after {
    display: block;
    content: "";
    clear: both;
}

.coupon-item {
    float: left;
    margin: 15px 8px;
    width: 190px;
    height: 100px;
    padding: 5px;
    background-color: #fa3030;
    cursor: pointer;
}

.coupon-list .active {
    background-color: #fa9000;
}

.coupon-list .disable {
    cursor: not-allowed;
    background-color: #fa6060;
}

.coupon-condition {
    font-size: 12px;
    text-align: center;
    color: #fff;
}

.coupon-name {
    color: #fff;
    font-size: 24px;
    text-align: center;
}

.coupon-time {
    text-align: left;
    color: #fff;
    font-size: 12px;
}

.unselect {
    margin-left: 0;
    transform: rotate(-90deg);
}

.is_selected {
    transform: rotate(-1turn) !important;
}
</style>
