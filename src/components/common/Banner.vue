<template>
    <el-carousel height="710px" :interval="3000" arrow="always">
        <el-carousel-item v-for="(value, index) in banner_list" :key="index">
            <a :href="value['link']"><img :src="value['image_url']" alt=""></a>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
export default {
    name: "Banner",
    data() {
        return {
            banner_list: [],
        }
    },
    created() {
        this.get_banner_list();
    },
    methods: {
        get_banner_list() {
            this.$axios({
                url: this.$settings.HOST + "home/banner/",
                method: 'get'
            }).then(res => {
                // console.log(res);
                this.banner_list = res.data;
            }).catch(error => {
                console.log(error);
            })
        }
    },
}
</script>

<style scoped>
.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
</style>
