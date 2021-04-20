<template>
    <div>
        <Header/>
        <div class="main">
            <div class="course-info">
                <!-- 视频播放 -->
                <div class="wrap-left">
                    <videoPlayer class="video-player vjs-custom-skin"
                                 ref="videoPlayer"
                                 :options="playerOptions"
                                 :playsinline="true">
                    </videoPlayer>
                </div>
                <div class="wrap-right">
                    <h3 class="course-name">{{ course_info.name }}</h3>
                    <p class="data">{{ course_info.students }}人在学&nbsp;&nbsp;&nbsp;&nbsp;课程总时长：
                        {{ course_info.lessons }}课时/89小时&nbsp;&nbsp;&nbsp;&nbsp;难度：{{ course_info.level_n }}</p>
                    <div class="sale-time" v-show="parseFloat(course_info.real_price)!==parseFloat(course_info.price)">
                        <p class="sale-type">{{ course_info.discount_name }}</p>
                        <p class="expire">距离结束：仅剩 {{ days }} 天 {{ (Array(2).join(0) + hours).slice(-2) }} 小时
                            {{ (Array(2).join(0) + minutes).slice(-2) }} 分钟<span
                                class="second">{{ (Array(2).join(0) + seconds).slice(-2) }}</span>秒</p>
                    </div>
                    <p class="course-price" v-if="parseFloat(course_info.real_price)!==parseFloat(course_info.price)">
                        <span>活动价</span>
                        <span class="discount">¥{{ course_info.real_price }}</span>
                        <span class="original">¥{{ course_info.price }}</span>
                    </p>
                    <p class="course-price" v-else>
                        <span>价格</span>
                        <span class="discount">¥{{ course_info.price }}</span>
                    </p>
                    <div class="buy">
                        <div class="buy-btn">
                            <button class="buy-now">立即购买</button>
                            <button class="free">免费试学</button>
                        </div>
                        <div class="add-cart" @click="add_cart">
                            <!--                            <img src="" alt="">-->
                            加入购物车
                        </div>
                    </div>
                </div>
            </div>
            <div class="course-tab">
                <ul class="tab-list">
                    <li :class="tabIndex===1?'active':''" @click="tabIndex=1">
                        详情介绍
                    </li>
                    <li :class="tabIndex===2?'active':''" @click="tabIndex=2">
                        课程章节
                        <span :class="tabIndex!==2?'free':''" v-show="course_info.type === '限时免费'">
                            (试学)
                        </span>
                    </li>
                    <li :class="tabIndex===3?'active':''" @click="tabIndex=3;get_comment">
                        学生评论 ({{ comment.length }})
                    </li>
                    <li :class="tabIndex===4?'active':''" @click="tabIndex=4">常见问题</li>
                </ul>
            </div>
            <div class="course-content">
                <div class="course-tab-list">
                    <div class="tab-item" v-if="tabIndex===1">
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ course_info.brief }}</p>
                    </div>
                    <div class="tab-item" v-if="tabIndex===2">
                        <div class="tab-item-title">
                            <p class="chapter">课程章节</p>
                            <p class="chapter-length">共<span
                                v-if="course_info['lesson_info']">{{ course_info['lesson_info'].length }}</span>章
                                {{ course_info.pub_lessons }}个课时
                            </p>
                        </div>
                        <div class="chapter-item" v-for="(value, index) in course_info.lesson_info" :key="index">
                            <p class="chapter-title">
                                <!--                                <img src="" alt="">-->
                                第{{ value.chapter }}章 {{ value.chapter_name }}
                            </p>
                            <ul class="lesson-list" v-for="(value1, key) in value.lesson" :key="key">
                                <li class="lesson-item">
                                    <p class="name">
                                        <span class="index">
                                            {{ value.chapter }}-
                                            {{ value1.lesson_orders }}
                                    </span>
                                        {{ value1.name }}
                                        <span class="free"
                                              v-show="value1.free_trail || course_info.type === '限时免费'">免费</span>
                                    </p>
                                    <p class="time">{{ value1.duration }}
                                        <!--                                        <img src="" alt="">-->
                                    </p>
                                    <button class="try">立即试学</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="tab-item" v-if="tabIndex===3">
                        <div align="center" style="padding-top: 10px;padding-bottom: 10px">
                            <el-input
                                type="textarea"
                                autosize
                                placeholder="请输入内容"
                                v-model="textarea"
                                style="width: 750px">
                            </el-input>
                            <el-button size="small" @click="give_comment" round>发 送</el-button>
                        </div>
                        <span v-for="(value, index) in comment" :key="index">
                                <span style="font-size: 14px;color: #888888;padding-left: 3%">
                                    {{ value.username }}
                                </span>
                                <br>
                                <div>
                                    <span style="padding-left: 3%">{{ value.text }}</span>
                                    <!--                                    {{sessionStorage.username}}-->
                                    <span v-show="value.username === $store.state.username">
                                    <el-popconfirm title="确定要删除这条信息吗？" @confirm="del_comment(value.id, index)"
                                                   icon="el-icon-info"
                                                   icon-color="red">
                                        <div class="delete" slot="reference">删除</div>
                                     </el-popconfirm>
                                    </span>
                                    <br>
                                </div>
                                <span style="font-size: 14px;color: #888888;padding-left: 3%">
                                    {{ show_date(value.date) }}
                                </span>
                                <hr style="border:solid 1px #eeeeee;height:0;width: 95%">
                            </span>
                    </div>

                    <div class="tab-item" v-if="tabIndex===4">
                        常见问题
                    </div>
                </div>
                <div class="course-side">
                    <div class="teacher-info">
                        <h4 class="side-title"><span>授课老师</span></h4>
                        <div class="teacher-content" v-if="course_info.teacher">
                            <div class="cont1">
                                <img :src="course_info.teacher.image" alt="">
                                <div class="name">
                                    <p class="teacher-name">{{ course_info.teacher.name }}</p>
                                    <p class="teacher-title">{{ course_info.teacher.brief }}</p>
                                </div>
                            </div>
                            <p class="narrative">{{ course_info.teacher.role_name }}，{{ course_info.teacher.title }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <Footer/>
        </div>
    </div>
</template>

<script>
import Header from "./common/Header";
import Footer from "./common/Footer";
import {videoPlayer} from "vue-video-player";
import {formatDate} from '../utils/date.js';

export default {
    name: "Detail",
    components: {
        Header: Header,
        Footer: Footer,
        videoPlayer: videoPlayer,
    },
    data() {
        return {
            tabIndex: 2,
            course_info: {},
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            time: 0,
            playerOptions: {
                playbackRates: [0.5, 1.0, 1.5, 2.0], // 播放速度
                autoplay: false, //如果true,则自动播放
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 循环播放
                preload: 'auto',  // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{ // 播放资源和资源格式
                    type: "video/mp4",
                    src: "" //你的视频地址（必填）
                }],
                poster: "", //视频封面图
                width: document.documentElement.clientWidth, // 默认视频全屏时的最大宽度
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
            },
            textarea: '', //评论
            comment: [],
        }
    },
    created() {
        // console.log(this.$route.params.id);
        this.get_course_info();
        this.get_comment();
    },
    methods: {
        get_course_info() {
            this.$axios.get(this.$settings.HOST + 'course/info/', {
                params: {
                    search: this.$route.params.id,
                }
            }).then(res => {
                // console.log(res);
                this.time = res.data[0].active_time;
                this.playerOptions.sources[0].src = res.data[0].course_video;
                if (!res.data[0].course_video)
                    this.playerOptions.notSupportedMessage = '无试看视频，请耐心等待，我们会竭尽所能为你争取！'
                this.course_info = res.data[0];
            }).catch(error => {
                console.log(error);
            })
        },
        get_comment() {
            this.$axios({
                url: this.$settings.HOST + 'course/get_comment/',
                method: 'get',
                params: {
                    course: this.$route.params.id,
                }
            }).then(res => {
                // console.log(res.data);
                this.comment = res.data.results;
            }).catch(error => {
                console.log(error);
            })
        },
        give_comment() {
            if (sessionStorage.username !== undefined) {
                if (!/^\s*$/.test(this.textarea)) {
                    this.$axios({
                        url: this.$settings.HOST + 'course/comment/',
                        method: 'post',
                        data: {
                            course: this.$route.params.id,
                            text: this.textarea,
                            user: sessionStorage.user_id,
                        },
                        headers: {
                            'Authorization': 'auth ' + sessionStorage.token
                        },
                    }).then(res => {
                        this.$message({
                            showClose: true,
                            message: '评论成功！',
                            type: 'success',
                        });
                        this.comment.unshift(res.data);
                    }).catch(error => {
                        console.log(error);
                    })
                    this.textarea = '';
                }
            } else {
                this.textarea = '';
                this.$message({
                    showClose: true,
                    message: '请先进行登录！',
                    type: 'error',
                });
            }
            // console.log(this.comment);
        },
        del_comment(id, index) {
            if (sessionStorage.username !== undefined) {
                this.$axios({
                    url: this.$settings.HOST + 'course/comment/',
                    method: 'delete',
                    data: {
                        course: this.$route.params.id,
                        id: id,
                    },
                    headers: {
                        'Authorization': 'auth ' + sessionStorage.token
                    },
                }).then(res => {
                    this.$message({
                        showClose: true,
                        message: '删除成功！',
                        type: 'success',
                    });
                    this.comment.splice(index, 1);
                }).catch(error => {
                    console.log(error);
                })
            } else {
                this.$message({
                    showClose: true,
                    message: '请先登录！',
                    type: 'error',
                });
            }
        },
        show_date(date) {
            let obj = new Date();
            if (date.search(obj.getFullYear()) !== -1)
                return formatDate({date: date, formatStr: 'MM-dd HH:mm:ss'})
            else
                return formatDate({date: date, formatStr: 'yyyy-MM-dd HH:mm:ss'})
        },
        // 用户在操作购物车时必须已经登录
        check_user_login() {
            if (!sessionStorage.token) {
                this.$confirm("请登录后再添加购物车，点击确认可前往登录！").then(() => {
                    this.$router.push('/login');
                })
                return false;
            }
        },
        // 向后端发请求添加购物车
        add_cart() {
            // 添加购物车时必须已经登录
            this.check_user_login();
            this.$axios.post(this.$settings.HOST + "cart/option/", {
                course_id: this.$route.params.id
            }, {
                headers: {
                    // 由于此视图需要认证，所以需要携带token
                    "Authorization": "auth " + sessionStorage.token
                },
            }).then(res => {
                this.$message.success(res.data.message);
                // 当添加购物车时，向状态机提交一个动作修改购物车数量
                this.$store.commit("change_count", res.data.cart_length);
            }).catch(error => {
                console.log(error);
            })
        },
    },
    mounted() {
        this.timer = setInterval(() => {
            this.days = parseInt(this.time / (60 * 60 * 24));
            this.hours = parseInt((this.time % (60 * 60 * 24)) / (60 * 60));
            this.minutes = parseInt((this.time % (60 * 60)) / 60);
            this.seconds = this.time % 60;
            this.time--;
        }, 1000)
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
        }
    },
}
</script>

<style scoped>
.footer {

}

.main {
    background: #fff;
    padding-top: 30px;
}

.course-info {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
}

.wrap-left {
    float: left;
    width: 690px;
    height: 388px;
    background-color: #000;
}

.wrap-right {
    float: left;
    position: relative;
    height: 388px;
}

.course-name {
    font-size: 20px;
    color: #333;
    padding: 10px 23px;
    letter-spacing: .45px;
}

.data {
    padding-left: 23px;
    padding-right: 23px;
    padding-bottom: 16px;
    font-size: 14px;
    color: #9b9b9b;
}

.sale-time {
    width: 464px;
    background: #84cc39;
    font-size: 14px;
    color: #4a4a4a;
    padding: 10px 23px;
    overflow: hidden;
}

.sale-type {
    font-size: 16px;
    color: #fff;
    letter-spacing: .36px;
    float: left;
}

.sale-time .expire {
    font-size: 14px;
    color: #fff;
    float: right;
}

.sale-time .expire .second {
    width: 24px;
    display: inline-block;
    background: #fafafa;
    color: #5e5e5e;
    padding: 6px 0;
    text-align: center;
}

.course-price {
    background: #fff;
    font-size: 14px;
    color: #4a4a4a;
    padding: 5px 23px;
}

.discount {
    font-size: 26px;
    color: #fa6240;
    margin-left: 10px;
    display: inline-block;
    margin-bottom: -5px;
}

.original {
    font-size: 14px;
    color: #9b9b9b;
    margin-left: 10px;
    text-decoration: line-through;
}

.buy {
    width: 464px;
    padding: 0 23px;
    position: absolute;
    left: 0;
    bottom: 20px;
    overflow: hidden;
}

.buy .buy-btn {
    float: left;
}

.buy .buy-now {
    width: 125px;
    height: 40px;
    border: 0;
    background: #ffc210;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    margin-right: 15px;
    outline: none;
}

.buy .free {
    width: 125px;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 15px;
    background: #fff;
    color: #ffc210;
    border: 1px solid #ffc210;
}

.add-cart {
    float: right;
    font-size: 14px;
    color: #ffc210;
    text-align: center;
    cursor: pointer;
    margin-top: 10px;
}

.delete {
    float: right;
    font-size: 14px;
    color: #ffc210;
    text-align: center;
    cursor: pointer;
    margin-top: 20px;
    margin-right: 30px;
}

.add-cart img {
    width: 20px;
    height: 18px;
    margin-right: 7px;
    vertical-align: middle;
}

.course-tab {
    width: 100%;
    background: #fff;
    margin-bottom: 30px;
    box-shadow: 0 2px 4px 0 #f0f0f0;

}

.course-tab .tab-list {
    width: 1200px;
    margin: auto;
    color: #4a4a4a;
    overflow: hidden;
}

.tab-list li {
    float: left;
    margin-right: 15px;
    padding: 26px 20px 16px;
    font-size: 17px;
    cursor: pointer;
}

.tab-list .active {
    color: #ffc210;
    border-bottom: 2px solid #ffc210;
}

.tab-list .free {
    color: #fb7c55;
}

.course-content {
    width: 1200px;
    margin: 0 auto;
    /*background: #FAFAFA;*/
    overflow: hidden;
}

.course-tab-list {
    width: 880px;
    height: auto;
    background: #fff;
    padding: 10px 860px 20px 0;
    float: left;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    box-shadow: 0 2px 4px 0 #ffffff;
}

.tab-item {
    padding-left: 10px;
    width: 840px;
    height: auto;
    background: #fff;
    line-height: 25px;
    padding-bottom: 20px;
    box-shadow: 0 2px 4px 2px #f0f0f0;
}

.tab-item-title {
    justify-content: space-between;
    padding: 25px 20px 11px;
    border-radius: 4px;
    margin-bottom: 20px;
    border-bottom: 1px solid #333;
    border-bottom-color: rgba(51, 51, 51, .05);
    overflow: hidden;
}

.chapter {
    font-size: 17px;
    color: #4a4a4a;
    float: left;
}

.chapter-length {
    float: right;
    font-size: 14px;
    color: #9b9b9b;
    letter-spacing: .19px;
}

.chapter-title {
    font-size: 16px;
    color: #4a4a4a;
    letter-spacing: .26px;
    padding: 12px;
    background: #eee;
    border-radius: 2px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
}

.chapter-title img {
    width: 18px;
    height: 18px;
    margin-right: 7px;
    vertical-align: middle;
}

.lesson-list {
    padding: 0 20px;
}

.lesson-list .lesson-item {
    padding: 15px 20px 15px 36px;
    cursor: pointer;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
}

.lesson-item .name {
    font-size: 14px;
    color: #666;
    float: left;
}

.lesson-item .index {
    margin-right: 5px;
}

.lesson-item .free {
    font-size: 12px;
    color: #fff;
    letter-spacing: .19px;
    background: #ffc210;
    border-radius: 100px;
    padding: 1px 9px;
    margin-left: 10px;
}

.lesson-item .time {
    font-size: 14px;
    color: #666;
    letter-spacing: .23px;
    opacity: 1;
    transition: all .15s ease-in-out;
    float: right;
}

.lesson-item .time img {
    width: 18px;
    height: 18px;
    margin-left: 15px;
    vertical-align: text-bottom;
}

.lesson-item .try {
    width: 86px;
    height: 28px;
    background: #ffc210;
    border-radius: 4px;
    font-size: 14px;
    color: #fff;
    position: absolute;
    right: 20px;
    top: 10px;
    opacity: 0;
    transition: all .2s ease-in-out;
    cursor: pointer;
    outline: none;
    border: none;
}

.lesson-item:hover {
    background: #fcf7ef;
    box-shadow: 0 0 0 0 #f3f3f3;
}

.lesson-item:hover .name {
    color: #333;
}

.lesson-item:hover .try {
    opacity: 1;
}

.course-side {
    width: 300px;
    height: auto;
    margin-left: 20px;
    float: right;
}

.teacher-info {
    background: #fff;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px 0 #f0f0f0;
}

.side-title {
    font-weight: normal;
    font-size: 17px;
    color: #4a4a4a;
    padding: 18px 14px;
    border-bottom: 1px solid #333;
    border-bottom-color: rgba(51, 51, 51, .05);
}

.side-title span {
    display: inline-block;
    border-left: 2px solid #ffc210;
    padding-left: 12px;
}

.teacher-content {
    padding: 30px 20px;
    box-sizing: border-box;
}

.teacher-content .cont1 {
    margin-bottom: 12px;
    overflow: hidden;
}

.teacher-content .cont1 img {
    width: 54px;
    height: 54px;
    margin-right: 12px;
    float: left;
}

.teacher-content .cont1 .name {
    float: right;
}

.teacher-content .cont1 .teacher-name {
    width: 188px;
    font-size: 16px;
    color: #4a4a4a;
    padding-bottom: 4px;
}

.teacher-content .cont1 .teacher-title {
    width: 188px;
    font-size: 13px;
    color: #9b9b9b;
    white-space: nowrap;
}

.teacher-content .narrative {
    font-size: 14px;
    color: #666;
    line-height: 24px;
}
</style>

