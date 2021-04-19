<template>
    <el-carousel height="710px" :interval="3000" arrow="always">
        <el-carousel-item v-for="(value, index) in banner_list" :key="index">
            <router-link :to="value['link']"><img class="img1" :src="value['image_url']" width="100%" alt=""></router-link>
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
.img1 {
    position:absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    margin:auto;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
}

/*.el-carousel__item:nth-child(2n) {*/
/*    background-color: #99a9bf;*/
/*}*/

.el-carousel__item:nth-child(n) {
    /*background-color: #d3dce6;*/
    background-color: #25292e;
}
</style>
