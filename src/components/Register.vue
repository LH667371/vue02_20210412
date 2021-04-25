<template>
    <div class="box">
        <img src="../../static/image/background.jpg" alt="">
        <div class="register">
            <div class="register_box">
                <div class="register-title">百知教育在线平台注册</div>
                <div class="inp">
                    <el-input style="padding-top: 23px" placeholder="手机号码" v-model="phone"></el-input>
                    <el-popover placement="right" title="密码输入要求" :width="200" trigger="hover"
                                content="数字、英文、字符中的两种及以上，长度为6-20。">
                        <template #reference>
                            <el-input placeholder="密码" v-model="password" show-password></el-input>
                        </template>
                    </el-popover>
                    <el-input class="phone_msg" placeholder="短信验证码" v-model="code"></el-input>
                    <el-button style="width: 142px;font-size: 14px" plain :disabled="get_code_status"
                               @click="send_code">{{ get_code_info }}
                    </el-button>
                    <div id="geetest"></div>
                    <button class="register_btn" @click="user_register">注册</button>
                    <p class="go_login">已有账号？
                        <span><router-link style="font-size: 14px" to="/login">直接登录</router-link></span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Register",
    data() {
        return {
            phone: '',
            password: '',
            code: '',
            get_code_info: '获取验证码',
            get_code_status: false,
            count: 60,   // 定义多少秒后可以点击发送验证码
        }
    },
    created() {
        if (sessionStorage.token) {
            this.$router.push('/');
        }
    },
    methods: {
        send_code() {
            // 验证手机号格式
            if (!/^1([358][0-9]|4[01456879]|6[2567]|7[0-8]|9[0-3,5-9])\d{8}$/.test(this.phone)) {
                if (this.phone)
                    this.$message({
                        showClose: true,
                        message: '手机号格式有误，请重新输入！',
                        type: 'error',
                    });
                else
                    this.$message({
                        showClose: true,
                        message: '手机号为空，请输入！',
                        type: 'error',
                    });
            } else
                // 发送请求，获取验证码
                this.$axios({
                    url: this.$settings.HOST + "user/send_code/",
                    method: 'get',
                    params: {
                        phone: this.phone,
                        status: 'register',
                    }
                }).then(res => {
                    // console.log(res.data.message);
                    if (res.data['message1'])
                        this.$confirm(res.data['message1'], '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            this.$router.push('/login');
                        }).catch(() => {
                        });
                    else {
                        this.$message({
                            showClose: true,
                            message: res.data.message,
                            type: 'success',
                        });
                        this.countdown();
                    }
                }).catch(error => {
                    // console.log(error.response.data.message);
                    this.$message({
                        showClose: true,
                        message: error.response.data.message,
                        type: 'error',
                    });
                })
        },
        countdown() {
            this.get_code_status = true;
            let count = this.count;
            this.get_code_info = count + '秒后重新获取';
            this.timer = setInterval(() => {
                count--;
                if (count === 0) {
                    clearInterval(this.timer)
                    this.get_code_info = '重新获取';
                    this.get_code_status = false;
                } else {
                    this.get_code_info = count + '秒后重新获取';
                }
            }, 1000)
        },
        // 用户注册请求
        user_register() {
            // 验证手机号格式
            if (!/^1([358][0-9]|4[01456879]|6[2567]|7[0-8]|9[0-3,5-9])\d{8}$/.test(this.phone)) {
                if (this.phone)
                    this.$message({
                        showClose: true,
                        message: '手机号格式有误，请重新输入！',
                        type: 'error',
                    });
                else
                    this.$message({
                        showClose: true,
                        message: '手机号为空，请输入！',
                        type: 'error',
                    });
            } else if (!/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/.test(this.password)) {
                if (this.password)
                    this.$message({
                        showClose: true,
                        message: '密码格式有误，请重新输入！',
                        type: 'error',
                    });
                else
                    this.$message({
                        showClose: true,
                        message: '密码为空，请输入！',
                        type: 'error',
                    });
            } else if (!/\d{4,6}/.test(this.code))
                if (this.code)
                    this.$message({
                        showClose: true,
                        message: '验证码不符合要求，请重新输入！',
                        type: 'error',
                    });
                else
                    this.$message({
                        showClose: true,
                        message: '验证码为空，请输入！',
                        type: 'error',
                    });
            else
                this.$axios({
                    url: this.$settings.HOST + "user/register/",
                    method: 'post',
                    data: {
                        phone: this.phone,
                        password: this.password,
                        sms_code: this.code,
                    }
                }).then(res => {
                    // 保持登录状态
                    sessionStorage.token = res.data.token;
                    sessionStorage.username = res.data.username;
                    sessionStorage.id = res.data.id;
                    // 页面跳转
                    let self = this;
                    this.$alert("注册成功!", "百知教育", {
                        callback() {
                            self.$router.push("/");
                        }
                    })
                }).catch(error => {
                    // console.log(error.response.data['non_field_errors']);
                    if (error.response.data['non_field_errors'])
                        this.$message({
                            showClose: true,
                            message: error.response.data['non_field_errors'][0],
                            type: 'error',
                        });
                    else {
                        this.$message({
                            showClose: true,
                            message: '注册失败，请获取验证码！',
                            type: 'error',
                        });
                        this.code = '';
                    }
                })
        },
    }
}
</script>

<style scoped>
.box {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
}

.box img {
    width: 100%;
    min-height: 100%;
}

.box .register {
    position: absolute;
    width: 600px;
    height: 300px;
    left: 0;
    margin: auto;
    right: 0;
    bottom: 0;
    top: -100px;
}

.register .register-title {
    width: 100%;
    font-size: 24px;
    text-align: center;
    padding-top: 45px;
    padding-bottom: 0;
    color: #4a4a4a;
    letter-spacing: .39px;
}

.register-title img {
    width: 190px;
    height: auto;
}

.register-title p {
    font-family: PingFangSC-Regular, sans-serif;
    font-size: 18px;
    color: #fff;
    letter-spacing: .29px;
    padding-top: 10px;
    padding-bottom: 50px;
}

.register_box {
    width: 380px;
    height: 380px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5);
    border-radius: 4px;
    margin: 0 auto;
    padding-bottom: 40px;
}

.register_box .title {
    font-size: 20px;
    color: #9b9b9b;
    letter-spacing: .32px;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-around;
    padding: 50px 60px 0 60px;
    margin-bottom: 20px;
    cursor: pointer;
}

.register_box .title span:nth-of-type(1) {
    color: #4a4a4a;
    border-bottom: 2px solid #84cc39;
}

.inp {
    width: 300px;
    margin: 0 auto;
}

.inp div {
    margin-bottom: 5px;
    margin-top: 10px;
}

.inp input {
    outline: 0;
    width: 100%;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    text-indent: 20px;
    font-size: 14px;
    background: #fff !important;
}

.inp input.user {
    margin-bottom: 16px;
}

.inp .rember {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-top: 10px;
}

.inp .rember p:first-of-type {
    font-size: 12px;
    color: #4a4a4a;
    letter-spacing: .19px;
    margin-left: 22px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    /*position: relative;*/
}

.inp .rember p:nth-of-type(2) {
    font-size: 14px;
    color: #9b9b9b;
    letter-spacing: .19px;
    cursor: pointer;
}

.inp .rember input {
    outline: 0;
    width: 30px;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    text-indent: 20px;
    font-size: 14px;
    background: #fff !important;
}

.inp .rember p span {
    display: inline-block;
    font-size: 12px;
    width: 100px;
    /*position: absolute;*/
    /*left: 20px;*/
}


.register_btn {
    width: 100%;
    height: 45px;
    background: #84cc39;
    border-radius: 5px;
    font-size: 16px;
    color: #fff;
    letter-spacing: .26px;
    margin-top: 30px;
}

.inp .go_login {
    text-align: center;
    font-size: 14px;
    color: #9b9b9b;
    letter-spacing: .26px;
    padding-top: 20px;
}

.inp .go_login span {
    color: #84cc39;
    cursor: pointer;
}

.phone_msg {
    width: 153px;
}

#geetest {
    height: 5px;
}
</style>
