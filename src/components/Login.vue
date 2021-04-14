<template>
    <div>
        <div class="login box">
            <img src="../../static/image/background.jpg" alt="">
            <div class="login">
                <div class="login-title">
                    <img src="../../static/image/logo.png" alt="">
                    <p>百知教育给你最优质的学习体验!</p>
                </div>
                <div class="login_box">
                    <div class="title">
                        <span @click="choice=true;code='';phone='';" :class="activeClass=choice?'span':''">密码登录</span>
                        <span @click="choice=false;code='';phone='';" :class="activeClass=choice?'':'span'">短信登录</span>
                    </div>
                    <div class="inp" v-show="choice">
                        <el-input placeholder="用户名 / 手机号码 / 邮箱" v-model="username"></el-input>
                        <el-input placeholder="密码" v-model="password" show-password></el-input>
                        <div class="div_geetest1" id="geetest1"></div>
                        <div class="rember">
                            <p>
                                <input type="checkbox" v-model="remember"/>
                                <span>记住密码</span>
                            </p>
                            <p @click="forgetPassword = true">忘记密码</p>
                        </div>
                        <button class="login_btn btn btn-primary" @click="get_captcha">登录</button>
                        <p class="go_login">没有账号？
                            <router-link style="font-size: 14px;" to="/register">立即注册</router-link>
                        </p>
                    </div>
                    <div class="inp" v-show="!choice">
                        <el-input placeholder="手机号码" v-model="phone"></el-input>
                        <el-input class="phone_msg" placeholder="短信验证码" v-model="code"></el-input>
                        <el-button style="width: 142px;font-size: 14px" plain :disabled="get_code_status"
                                   @click="send_code">{{ get_code_info }}
                        </el-button>
                        <div class="div1"></div>
                        <button class="login_btn" @click="message_login">登录</button>
                        <p class="go_login">没有账号？
                            <router-link style="font-size: 14px;" to="/register">立即注册</router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="找回密码" :visible.sync="forgetPassword" width="25%" :close-on-click-modal="false" @close="reset_data" center>
            <div v-show="!check" align="center">
                <el-input style="margin-top: 10px;" placeholder="手机号码"
                          v-model="phone"></el-input>
                <el-input style="margin-top: 20px;" placeholder="短信验证码"
                          v-model="code">
                    <el-button style="width: 140px;font-size: 14px" slot="append" :disabled="get_code_status"
                               @click="send_code">{{ get_code_info }}
                    </el-button>
                </el-input>

            </div>
            <div v-show="check" align="center">
                <el-input style="margin-top: 10px;" placeholder="密码" v-model="c_password"
                          show-password></el-input>
                <el-input style="margin-top: 20px;" placeholder="再次输入密码"
                          v-model="re_password" show-password></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" v-show="!check" @click="enter_change">确 定</el-button>
                <el-button type="primary" v-show="check" @click="change_password">确 定</el-button>
                <el-button @click="forgetPassword = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "login",
    data() {
        return {
            choice: true,
            choice1: true,
            username: '',
            phone: '',
            password: '',
            c_password: '',
            re_password: '',
            remember: false,
            get_code_info: '获取验证码',
            get_code_status: false,
            code: '',
            count: 60,   // 定义多少秒后可以点击发送验证码
            forgetPassword: false,
            check: false,
            token_change: '',
        }
    }
    , created() {
        if (localStorage.username) {
            this.username = localStorage.username;
            this.password = localStorage.password;
            this.remember = true;
        }
        if (sessionStorage.token) {
            this.$router.push('/');
        }
    }
    , methods: {
        // 点击登录按钮  获取验证码
        get_captcha() {
            if (this.username === '' || this.password === '')
                this.$message({
                    showClose: true,
                    message: '输入用户名或密码不允许为空！',
                    type: 'error',
                });
            else
                this.$axios({
                    url: this.$settings.HOST + "user/captcha/",
                    method: 'get',
                    params: {
                        username: this.username
                    }
                }).then(res => {
                    let data = res.data;
                    initGeetest({
                        gt: data.gt,
                        challenge: data.challenge,
                        product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                        offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                        new_captcha: data.new_captcha
                    }, this.handlerPopup);
                }).catch(error => {
                    console.log(error);
                    this.$message({
                        showClose: true,
                        message: JSON.parse(error.request.response)['msg'],
                        type: 'error',
                    });
                })
        },
        // 获取验证码的回调函数  完成验证码验证的
        handlerPopup(captchaObj) {
            let self = this;
            captchaObj.onSuccess(function () {
                // 获取验证码对象
                let validate = captchaObj.getValidate();
                // 当用户滑动滑块后会发送请求校验结果
                self.$axios({
                    url: self.$settings.HOST + "user/captcha/",
                    method: "post",
                    data: {
                        username: self.username,
                        geetest_challenge: validate.geetest_challenge,
                        geetest_validate: validate.geetest_validate,
                        geetest_seccode: validate.geetest_seccode
                    },
                }).then(res => {
                    // 验证码校验通过则完成登录
                    self.user_login()
                }).catch(error => {
                    console.log(error);
                })
            });
            // 在显示验证码之前先将div置为空
            document.getElementById("geetest1").innerHTML = "";
            // 显示验证码
            captchaObj.appendTo("#geetest1");
        },
        user_login() {
            this.$axios({
                url: this.$settings.HOST + "user/login/",
                method: "post",
                data: {
                    username: this.username,
                    password: this.password
                }
            }).then(res => {
                sessionStorage.token = res.data.token;
                sessionStorage.username = res.data.username;
                sessionStorage.user_id = res.data.user_id;
                if (this.remember) {
                    localStorage.username = this.username;
                    localStorage.password = this.password;
                } else {
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                }
                this.$router.push('/');
            }).catch(error => {
                console.log(error);
                this.$message({
                    showClose: true,
                    message: '输入的密码错误！',
                    type: 'error',
                });
                document.getElementById("geetest1").innerHTML = "";
                this.password = '';
            })
        },
        message_login() {
            if (!/\d{4,6}/.test(this.code))
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
                    url: this.$settings.HOST + "user/message_check/",
                    method: "post",
                    data: {
                        phone: this.phone,
                        code: this.code,
                        status: 'login'
                    }
                }).then(res => {
                    // console.log(res);
                    sessionStorage.token = res.data.token;
                    sessionStorage.username = res.data.username;
                    sessionStorage.user_id = res.data.user_id;
                    this.$router.push('/');
                }).catch(error => {
                    if (error.response.data.message)
                        this.$message({
                            showClose: true,
                            message: error.response.data.message,
                            type: 'error',
                        });
                    else {
                        this.$message({
                            showClose: true,
                            message: '登录失败，请获取验证码！',
                            type: 'error',
                        });
                        this.code = '';
                    }
                })
        },
        send_code() {
            // 验证手机号格式
            let code_type = this.forgetPassword ? 'forgot' : 'login';
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
                        status: code_type,
                    }
                }).then(res => {
                    // console.log(res.data);
                    this.$message({
                        showClose: true,
                        message: res.data.message,
                        type: 'success',
                    });
                    this.countdown();
                }).catch(error => {
                    console.log(error.response.status);
                    if (error.response.status === 400)
                        this.$confirm(error.response.data.message, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$router.push('/register');
                        }).catch(() => {
                        });
                    else
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
        enter_change() {
            if (!/\d{4,6}/.test(this.code))
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
                    url: this.$settings.HOST + "user/message_check/",
                    method: "post",
                    data: {
                        phone: this.phone,
                        code: this.code,
                        status: 'forgot'
                    }
                }).then(res => {
                    // console.log(res);
                    this.$message({
                        showClose: true,
                        message: '验证成功，请输入需要修改的密码！',
                        type: 'success',
                    });
                    this.token_change = res.data.token_change;
                    this.user_id = res.data.user_id;
                    this.check = true;
                }).catch(error => {
                    if (error.response.data.message)
                        this.$message({
                            showClose: true,
                            message: error.response.data.message,
                            type: 'error',
                        });
                    else {
                        this.$message({
                            showClose: true,
                            message: '请获取验证码！',
                            type: 'error',
                        });
                        this.code = '';
                    }
                })
        },
        change_password() {
            if (!/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/.test(this.c_password)) {
                if (this.c_password)
                    this.$message({
                        showClose: true,
                        message: '第一次输入的密码格式有误！',
                        type: 'error',
                    });
                else
                    this.$message({
                        showClose: true,
                        message: '密码为空，请输入！',
                        type: 'error',
                    });
            } else if (!/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/.test(this.re_password)) {
                if (this.re_password)
                    this.$message({
                        showClose: true,
                        message: '第二次输入的密码格式有误！',
                        type: 'error',
                    });
                else
                    this.$message({
                        showClose: true,
                        message: '密码为空，请输入！',
                        type: 'error',
                    });
            } else if (this.c_password !== this.re_password)
                this.$message({
                    showClose: true,
                    message: '两次密码输入不相等！',
                    type: 'error',
                });
            else
                this.$axios({
                    url: this.$settings.HOST + 'user/change_pwd/' + this.user_id + '/',
                    method: 'patch',
                    data: {
                        password: this.c_password
                    },
                    headers: {
                        'Authorization': 'auth ' + this.token_change
                    },
                }).then(res => {
                    // console.log(res);
                    this.forgetPassword = false;
                    this.$message({
                        showClose: true,
                        message: res.data.message,
                        type: 'success',
                    });
                }).catch(error => {
                    this.forgetPassword = false;
                    if (error.response.status === 401)
                        this.$message({
                            showClose: true,
                            message: '页面失效，请重新操作！',
                            type: 'error',
                        });
                })
        },
        reset_data(){
            this.phone = '';
            this.token_change = '';
            this.c_password = '';
            this.re_password = '';
            this.code = '';
        }
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

.box .login {
    position: absolute;
    width: 600px;
    height: 300px;
    left: 0;
    margin-left: auto;
    margin-right: auto;
    right: 0;
    bottom: 0;
    top: 100px;
}

.login .login-title {
    width: 100%;
    text-align: center;
}

.login-title img {
    width: 190px;
    height: auto;
}

.login-title p {
    font-family: PingFangSC-Regular, sans-serif;
    font-size: 18px;
    color: #4a4a4a;
    letter-spacing: 0.29px;
    padding-top: 10px;
    padding-bottom: 50px;
}

.login_box {
    width: 380px;
    height: 380px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5);
    border-radius: 4px;
    margin: 0 auto;
    padding-bottom: 40px;
}

.login_box .title {
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

/*.login_box .title span:nth-of-type(1) {*/
/*    color: #4a4a4a;*/
/*    border-bottom: 2px solid #84cc39;*/
/*}*/

.span {
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


.inp input.user {
    margin-bottom: 16px;
}

.inp .rember {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-top: 0;
    margin-bottom: -20px;
}

.inp .rember p:first-of-type {
    font-size: 12px;
    color: #4a4a4a;
    letter-spacing: .19px;
    margin-left: 1px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    /*position: relative;*/
}

.inp .rember p:nth-of-type(2) {
    font-size: 12px;
    color: #9b9b9b;
    letter-spacing: .19px;
    cursor: pointer;
}

.inp .rember input {
    outline: 0;
    width: 15px;
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
    padding-left: 5px;
    /*position: absolute;*/
    /*left: 20px;*/
}

.login_btn {
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

.div_geetest1 {
    height: 35px;
}

.div1 {
    height: 60px;
}
</style>
