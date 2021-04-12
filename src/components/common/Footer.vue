<template>
    <div class="footer">
        <ul>
            <li v-for="(value, index) in footer_list" :key="index">
                <a :href="value['link']" v-if="value['is_site']">{{ value['title'] }}</a>
                <router-link v-else :to="value['link']">{{ value['title'] }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "Footer",
    data() {
        return {
            footer_list: [],
        }
    },
    created() {
        this.get_footer_list();
    },
    methods: {
        get_footer_list() {
            this.$axios({
                url: this.$settings.HOST + 'home/footer/',
                method: 'get',
            }).then(res => {
                this.footer_list = res.data;
            }).catch(error => {
                console.log(error);
            })
        }
    }
}
</script>

<style scoped>
.footer {
    width: 100%;
    height: 147px;
    background: #25292e;
    color: #fff;
}

.footer ul {
    margin: 0 auto 16px;
    padding-top: 65px;
    width: 810px;
}

.footer ul li {
    float: left;
    width: 112px;
    margin: 0 10px;
    text-align: center;
    font-size: 14px;
}

.footer ul li a {
    background: #25292e;
    color: #fff;
}

.footer ul::after {
    content: "";
    display: block;
    clear: both;
}

.footer p {
    text-align: center;
    font-size: 12px;
}
</style>
