<template>
    <div class="cart_item">
        <div class="cart_column column_1">
            <el-checkbox class="my_el_checkbox" v-model="checked" @change="change_course_select"></el-checkbox>
        </div>
        <div class="cart_column column_2">
            <img :src="this.$settings.HOST + course.image" alt="">
            <span><router-link to="/course/detail/1">{{ course.name }}</router-link></span>
        </div>
        <div class="cart_column column_3">
            <el-select v-model="course.expire_id" size="mini" placeholder="请选择购买有效期" class="my_el_select">
                <el-option label="1个月有效" :value="1" :key="1"></el-option>
                <el-option label="2个月有效" :value="2" :key="2"></el-option>
                <el-option label="3个月有效" :value="3" :key="3"></el-option>
                <el-option label="永久有效" :value="0" :key="0"></el-option>
            </el-select>
        </div>
        <div class="cart_column column_4">¥{{ course.price }}</div>
        <div class="cart_column column_4">删除</div>
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
        }
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
                console.log(error);
            })
        },
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
</style>
