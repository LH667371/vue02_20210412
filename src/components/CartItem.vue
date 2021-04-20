<template>
    <div class="cart_item">
        <div class="cart_column column_1">
            <el-checkbox class="my_el_checkbox" v-model="checked" @change="change_course_select"></el-checkbox>
        </div>
        <div class="cart_column column_2">
            <img :src="this.$settings.HOST + course.image" alt="">
            <span><router-link :to="'/detail/'+course.course_id">{{ course.name }}</router-link></span>
        </div>
        <div class="cart_column column_3">
            <el-select v-model="course.expire_id" size="mini" placeholder="请选择购买有效期" class="my_el_select">
                <el-option v-for="item in course.expire_list" :label="item.expire_text" :value="item.id"
                           :key="item.id"></el-option>
            </el-select>
        </div>
        <div class="cart_column column_4">¥{{ parseFloat(course.expire_price===null?course.price:course.expire_price).toFixed(2) }}</div>
        <div class="cart_column column_4">
            <el-popconfirm icon="el-icon-info"
                           icon-color="red"
                           :title="'确定删除 '+this.course.name+' 吗？'"
                           @confirm="del_course">
                <span slot="reference">删除</span>
            </el-popconfirm>
        </div>
    </div>
</template>

<script>
export default {
    name: "CartItem",
    props: ['course'],
    watch: {
        // 监听勾选状态是否发生了变化
        "$store.state.select_id"() {
            this.checked = this.$store.state.select_id.includes(this.course.course_id);
        },
        "course.expire_id"() {
            this.change_course_expire();
        },
    },
    data() {
        return {
            checked: this.$store.state.select_id.includes(this.course.course_id),
        }
    },
    methods: {
        // 发起请求修改redis中的选中状态
        change_course_select() {
            this.$axios.patch(this.$settings.HOST + "cart/option/", {
                course_id: this.course.course_id,
                selected: this.checked,
            }, {
                headers: {
                    "Authorization": "auth " + sessionStorage.token
                }
            }).then(res => {
                // console.log(res);
                if (this.checked) {
                    this.$message('已勾选 ' + this.course.name);
                    this.$store.commit('add_select', this.course.course_id)
                } else {
                    this.$message('取消勾选 ' + this.course.name);
                    this.$store.commit('del_select', this.$store.state.select_id.indexOf(this.course.course_id))
                }
            }).catch(error => {
                if (error.response.data.detail === "Signature has expired.")
                    this.$confirm("登录已过期，请重新登录，点击确认可前往登录！").then(() => {
                        this.$store.commit('change_username', '');
                        this.$store.commit('change_count', '');
                        sessionStorage.clear();
                        this.$router.push('/login');
                    })
                console.log(error);
            })
        },
        change_course_expire() {
            this.$axios.patch(this.$settings.HOST + "cart/option/", {
                course_id: this.course.course_id,
                expire: this.course.expire_id,
            }, {
                headers: {
                    "Authorization": "auth " + sessionStorage.token
                }
            }).then(res => {
                // console.log(res);
                this.course.expire_price = res.data.expire_price;
                this.change_price();
            }).catch(error => {
                if (error.response.data.detail === "Signature has expired.")
                    this.$confirm("登录已过期，请重新登录，点击确认可前往登录！").then(() => {
                        this.$store.commit('change_username', '');
                        this.$store.commit('change_count', '');
                        sessionStorage.clear();
                        this.$router.push('/login');
                    })
                console.log(error);
            })
        },
        del_course() {
            let course_id = [];
            course_id.push(this.course.course_id);
            this.$axios({
                url: this.$settings.HOST + "cart/option/",
                method: 'delete',
                data: {
                    course_id: course_id,
                },
                headers: {
                    "Authorization": "auth " + sessionStorage.token
                }
            }).then(res => {
                // console.log(res);
                this.$store.commit('change_count', this.$store.state.cart_length !== 1 ? this.$store.state.cart_length - 1 : '');
                this.$store.state.cart_list.splice(this.$store.state.cart_list.indexOf(this.course), 1);
                this.$store.state.select_id.splice(this.$store.state.select_id.indexOf(this.course.course_id), 1);
                this.$message({
                    message: '已删除!',
                    type: "success"
                });
            }).catch(error => {
                console.log(error);
                if (error.response.data.detail === "Signature has expired.")
                    this.$confirm("登录已过期，请重新登录，点击确认可前往登录！").then(() => {
                        this.$store.commit('change_username', '');
                        this.$store.commit('change_count', '');
                        sessionStorage.clear();
                        this.$router.push('/login');
                    })
                else
                    this.$message({
                        message: '删除失败!',
                        type: "error"
                    });
            })
        },
        change_price () {
            this.$emit("c_price");
        }
    }
}
</script>

<style scoped>
.cart_item::after {
    content: "";
    display: block;
    clear: both;
}

.cart_column {
    float: left;
    height: 150px;
}

.cart_item .column_1 {
    width: 88px;
    position: relative;
}

.my_el_checkbox {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    width: 16px;
    height: 16px;
}

.cart_item .column_2 {
    padding: 20px 0;
    width: 520px;
    height: 0;
}

.cart_item .column_2 img {
    width: 175px;
    height: 115px;
    margin-right: 35px;
    vertical-align: middle;
}

.cart_item .column_3 {
    width: 208px;
    position: relative;
    padding-left: 0;
}

.my_el_select {
    width: 150px;
    height: 28px;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
}

.cart_item .column_4 {
    padding: 15px 15px;
    height: 116px;
    width: 142px;
    line-height: 116px;
}

.cart_item .column_4 span:hover {
    cursor: default;
    color: #ffc210;
}
</style>
