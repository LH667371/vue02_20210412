<template>
    <div>
        <Header></Header>
        <Banner></Banner>
        <Footer></Footer>
    </div>
</template>
<script>
import Header from "./common/Header";
import Footer from "./common/Footer";
import Banner from "./common/Banner";

export default {
    name: "Home",
    components: {
        Header: Header,
        Footer: Footer,
        Banner: Banner,
    },
    created() {
        if (sessionStorage.token)
            this.get_cart_length();
    },
    methods: {
        get_cart_length() {
            this.$axios.get(this.$settings.HOST + "cart/option/", {
                headers: {
                    // 由于此视图需要认证，所以需要携带token
                    "Authorization": "auth " + sessionStorage.token,
                },
            }).then(res => {
                console.log(res.data);
                this.$store.commit("change_count", res.data.length);
            }).catch(error => {
                console.log(error);
            })
        },
    }
}
</script>

<style scoped>

</style>
