<template>
    <div class="course">
        <Header></Header>
        <div class="main">
            <!-- 筛选条件 -->
            <div class="condition">
                <ul class="cate-list">
                    <li class="title">课程分类:</li>
                    <li :class="category===0?'this':''" @click="category=0">全部</li>
                    <li @click="category=cate.id" :class="category===cate.id?'this':''" v-for="cate in category_list"
                        :key="cate.id">
                        {{ cate.name }}
                    </li>
                </ul>

                <div class="ordering">
                    <ul>
                        <li class="title">筛&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选:</li>
                        <li class="default" @click="change_order_type('id')" :class="change_order_class('id')" style="">
                            默认
                        </li>
                        <li class="hot" @click="change_order_type('students')" :class="change_order_class('students')">
                            人气
                        </li>
                        <li @click="change_order_type('real_price')" :class="change_order_class('real_price')">价格
                        </li>
                    </ul>
                    <p class="condition-result">共21个课程</p>
                </div>

            </div>
            <!-- 课程列表 -->
            <div class="course-list" :style="{height: 290*filters.size+'px'}">
                <div class="course-item" v-for="course in course_list" :key="course.id">
                    <div class="course-image">
                        <img :src="course.course_img" alt="">
                    </div>
                    <div class="course-info">
                        <h3>
                            <router-link :to="'/detail/'+course.id">{{ course.name }}</router-link>
                            <span>
                                <img src="/static/image/avatar1.svg" alt="">{{ course.students }}人已加入学习
                            </span>
                        </h3>
                        <p class="teather-info">{{ course.teacher !== null ? course.teacher.name : '' }}
                            {{ course.teacher !== null ? course.teacher.title : '' }}
                            <span>
                                {{ course.lessons === course.pub_lessons ? '更新完成' : `已更新${course.pub_lessons}课时` }}
                                /共{{ course.lessons }}课时
                            </span>
                        </p>
                        <div style="height: 114px">
                            <ul class="lesson-list">
                                <li v-for="(lesson, index) in course.lesson_list" :key="index">
                                <span class="lesson-title">
                                    0{{ lesson.chapter }} | 第{{ lesson.orders }}节：
                                    {{ lesson.name }}
                                </span>
                                    <span v-if="lesson.free_trail" class="free">免费</span>
                                </li>
                            </ul>
                        </div>
                        <div class="pay-box">
                            <span class="discount-type" v-show="parseFloat(course.real_price)!==parseFloat(course.price)">{{ course.discount_name }}</span>
                            <span class="discount-price"
                                  v-show="parseFloat(course.real_price)!==parseFloat(course.price)">￥{{ parseFloat(course.real_price).toFixed(2) }}元</span>
                            <span class="original-price" v-show="parseFloat(course.real_price)!==parseFloat(course.price)">原价：{{ parseFloat(course.price).toFixed(2) }}元</span>
                            <span class="discount-price" v-show="parseFloat(course.real_price)===parseFloat(course.price)">￥{{ parseFloat(course.price).toFixed(2) }}元</span>
                            <span class="buy-now">立即购买</span>
                        </div>
                    </div>
                </div>
            </div>
            <el-pagination
                background
                :page-size="filters.size"
                layout="prev, pager, next, sizes"
                @current-change="change_page"
                @size-change="size_change"
                :page-sizes="[2,3,5,10]"
                :total="total">
            </el-pagination>
        </div>
        <Footer></Footer>
    </div>
</template>


<script>
import Footer from "./common/Footer";
import Header from "./common/Header";

export default {
    name: "Course",
    components: {
        Header: Header,
        Footer: Footer
    },
    data() {
        return {
            total: 0,   // 课程总数量
            category: 0,
            category_list: [],
            course_list: [],    // 课程列表数据
            // 排序筛选条件
            filters: {
                type: "id", // 默认的排序类型  id  students price
                orders: "asc", // 默认升序
                size: 2,    // 默认每页分页的数量
                page: 1,    // 默认页码
            }
        }
    },
    created() {
        if (this.$route.params)
            this.category = this.$route.params.category;
        this.get_category_list();
        this.get_course_list();
    },
    updated() {
        if (document.getElementsByTagName('li')[parseInt(this.category) + 6] && this.category_list[parseInt(this.category) - 1])
            if (document.getElementsByTagName('li')[parseInt(this.category) + 6].innerText === this.category_list[parseInt(this.category) - 1].name)
                document.getElementsByTagName('li')[parseInt(this.category) + 6].className = 'this';
        if (this.category === '0' && document.getElementsByTagName('li')[parseInt(this.category) + 6].innerText === '全部')
            document.getElementsByTagName('li')[parseInt(this.category) + 6].className = 'this';

    },
    watch: {
        // 当分类id的值变化时，根据当前点击分类重新获取对应课程
        category() {
            this.filters.page = 1;
            this.get_course_list();
            this.$router.push('/course/' + String(this.category)).catch(err => {
                console.log();
            });
        },
        '$route'(val, OldVal) {
            if (this.$route.params)
                this.category = this.$route.params.category;
            document.getElementsByTagName('li')[parseInt(val.params.category) + 6].className = 'this';
            document.getElementsByTagName('li')[parseInt(OldVal.params.category) + 6].className = '';
        },
    },
    methods: {
        // 每页展示数量的变化
        size_change(size) {
            // 修改每页展示的数量
            this.filters.size = size;
            // 重置页码 每次都是第一页
            this.filters.page = 1;
            this.get_course_list();
        },
        // 页码改变时触发
        change_page(page) {
            // 修改页码  并重新获取课程
            this.filters.page = page
            this.get_course_list();
        },

        // 获取课程列表的方法
        get_course_list() {
            let filters = {
                page: this.filters.page,
                size: this.filters.size,
            };

            // 判断是否需要通过分类id查询课程
            if (this.category > 0) {
                filters.course_category = this.category;
            }

            // 排序处理
            if (this.filters.orders === "desc") {
                filters.ordering = "-" + this.filters.type;
            } else {
                filters.ordering = this.filters.type;
            }
            this.$axios.get(this.$settings.HOST + "course/list/", {
                params: filters
            }).then(res => {
                // console.log(res.data);
                this.course_list = res.data.results;
                this.total = res.data.count;
            }).catch(error => {
                console.log(error.response);
            })
        },

        // 获取课程分类数据
        get_category_list() {
            this.$axios.get(this.$settings.HOST + "course/category/").then(res => {
                this.category_list = res.data;
            })
        },
        // 控制排序的高亮样式
        change_order_class(type) {
            if (this.filters.type === type && this.filters.orders === "asc") {
                return "this asc"
            } else if (this.filters.type === type && this.filters.orders === "desc") {
                return "this desc"
            } else {
                return ""
            }

        },
        // 修改排序的类型与方式
        change_order_type(type) {
            //  以及升序降序
            if (this.filters.type === type && this.filters.orders === "desc") {
                this.filters.orders = "asc";
            } else if (this.filters.type === type && this.filters.orders === "asc") {
                this.filters.orders = "desc";
            }
            //更改排序类型
            this.filters.type = type;
            // 点击排序后重新获取排序后的课程
            this.get_course_list();
        },
    },
}
</script>

<style scoped>
.course {
    background: #f6f6f6;
}

.course .main {
    width: 1100px;
    margin: 35px auto 0;
}

.course .condition {
    margin-bottom: 35px;
    padding: 10px 30px 10px 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px 0 #f0f0f0;
}

.course .cate-list {
    border-bottom: 1px solid #333;
    border-bottom-color: rgba(51, 51, 51, .05);
    padding-bottom: 18px;
    margin-bottom: 17px;
}

.course .cate-list::after {
    content: "";
    display: block;
    clear: both;
}

.course .cate-list li {
    float: left;
    font-size: 16px;
    padding: 6px 15px;
    line-height: 16px;
    margin-left: 14px;
    position: relative;
    transition: all .3s ease;
    cursor: pointer;
    color: #4a4a4a;
    border: 1px solid transparent; /* transparent 透明 */
}

.course .cate-list .title {
    color: #888;
    margin-left: 0;
    letter-spacing: .36px;
    padding: 0;
    line-height: 28px;
}

.course .cate-list .this {
    color: #ffc210;
    border: 1px solid #ffc210 !important;
    border-radius: 30px;
}

.course .ordering::after {
    content: "";
    display: block;
    clear: both;
}

.course .ordering ul {
    float: left;
}

.course .ordering ul::after {
    content: "";
    display: block;
    clear: both;
}

.course .ordering .condition-result {
    float: right;
    font-size: 14px;
    color: #9b9b9b;
    line-height: 28px;
}

.course .ordering ul li {
    float: left;
    padding: 6px 15px;
    line-height: 16px;
    margin-left: 14px;
    position: relative;
    transition: all .3s ease;
    cursor: pointer;
    color: #4a4a4a;
}

.course .ordering .title {
    font-size: 16px;
    color: #888;
    letter-spacing: .36px;
    margin-left: 0;
    padding: 0;
    line-height: 28px;
}

.course .ordering .this {
    color: #ffc210;
}

.course .ordering .price {
    position: relative;
}

.course .ordering .price::before,
.course .ordering .price::after {
    cursor: pointer;
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    right: 0;
}

.course .ordering .price::before {
    border-bottom: 5px solid #aaa;
    margin-bottom: 2px;
    top: 2px;
}

.course .ordering .price::after {
    border-top: 5px solid #aaa;
    bottom: 2px;
}

.asc::after {
    cursor: pointer;
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    right: 0;
    border-top: 5px solid #ffc210;
    bottom: 2px;
}

.asc::before {
    cursor: pointer;
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    right: 0;
    border-bottom: 5px solid #aaa;
    margin-bottom: 2px;
    top: 2px;
}

.desc::after {
    cursor: pointer;
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    right: 0;
    border-top: 5px solid #aaa;
    bottom: 2px;
}

.desc::before {
    cursor: pointer;
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    position: absolute;
    right: 0;
    border-bottom: 5px solid #ffc210;
    margin-bottom: 2px;
    top: 2px;
}

.course .course-item:hover {
    box-shadow: 4px 6px 16px rgba(0, 0, 0, .5);
}

.course .course-item {
    width: 1050px;
    background: #fff;
    padding: 10px 30px 10px 20px;
    margin-bottom: 35px;
    border-radius: 2px;
    cursor: pointer;
    box-shadow: 2px 3px 16px rgba(0, 0, 0, .1);
    /* css3.0 过渡动画 hover 事件操作 */
    transition: all .2s ease;
}

.course .course-item::after {
    content: "";
    display: block;
    clear: both;
}

/* 顶级元素 父级元素  当前元素{} */
.course .course-item .course-image {
    float: left;
    width: 423px;
    height: 243px;
    margin-right: 30px;
}

.course .course-item .course-image img {
    padding-top: 6px;
    width: 100%;
}

.course .course-item .course-info {
    float: left;
    width: 596px;
}

.course-item .course-info h3 {
    font-size: 26px;
    color: #333;
    font-weight: normal;
    margin-bottom: 8px;
}

.course-item .course-info h3 span {
    font-size: 14px;
    color: #9b9b9b;
    float: right;
    margin-top: 14px;
}

.course-item .course-info h3 span img {
    width: 11px;
    height: auto;
    margin-right: 7px;
}

.course-item .course-info .teather-info {
    font-size: 14px;
    color: #9b9b9b;
    height: 15px;
    margin-bottom: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid #333;
    border-bottom-color: rgba(51, 51, 51, .05);
}

.course-item .course-info .teather-info span {
    float: right;
}

.course-item .lesson-list::after {
    content: "";
    display: block;
    clear: both;
}

.course-item .lesson-list li {
    float: left;
    width: 44%;
    font-size: 14px;
    color: #666;
    padding-left: 22px;
    /* background: url("路径") 是否平铺 x轴位置 y轴位置 */
    /*background: url("/static/image/play-icon-gray.svg") no-repeat left 4px;*/
    margin-bottom: 15px;
}

.course-item .lesson-list li .lesson-title {
    /* 以下3句，文本内容过多，会自动隐藏，并显示省略符号 */
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    max-width: 200px;
}

.course-item .lesson-list li:hover {
    /*background-image: url("/static/image/play-icon-yellow.svg");*/
    color: #ffc210;
}

.course-item .lesson-list li .free {
    width: 34px;
    height: 15px;
    color: #fd7b4d;
    vertical-align: super;
    margin-right: 10px;
    border: 1px solid #fd7b4d;
    border-radius: 2px;
    text-align: center;
    font-size: 13px;
    white-space: nowrap;
    float: right;
}

.course-item .lesson-list li:hover .free {
    color: #ffc210;
    border-color: #ffc210;
}

.course-item .pay-box::after {
    content: "";
    display: block;
    clear: both;
}

.course-item .pay-box .discount-type {
    padding: 6px 10px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    margin-right: 8px;
    background: #fa6240;
    border: 1px solid #fa6240;
    border-radius: 10px 0 10px 0;
    float: left;
}

.course-item .pay-box .discount-price {
    font-size: 24px;
    color: #fa6240;
    float: left;
}

.course-item .pay-box .original-price {
    text-decoration: line-through;
    font-size: 14px;
    color: #9b9b9b;
    margin-left: 10px;
    float: left;
    margin-top: 10px;
}

.course-item .pay-box .buy-now {
    width: 120px;
    height: 38px;
    background: transparent;
    color: #fa6240;
    font-size: 16px;
    border: 1px solid #fd7b4d;
    border-radius: 3px;
    transition: all .2s ease-in-out;
    float: right;
    text-align: center;
    line-height: 38px;
}

.course-item .pay-box .buy-now:hover {
    color: #fff;
    background: #ffc210;
    border: 1px solid #ffc210;
}

.el-pagination {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 30px;
}
</style>
