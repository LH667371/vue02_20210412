import Vue from "vue"

import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 购物车课程数量
        cart_length: '',
        username: '',
        select_id: [],
    },
    mutations: {
        // 监测购物车的动作
        change_count(state, count) {
            state.cart_length = count;
        },
        change_username(state, name) {
            state.username = name;
        },
        add_select(state, id) {
            state.select_id.push(id);
        },
        del_select(state, id) {
            state.select_id.splice(id, 1);
        },
        all_del_select(state, check) {
            if (check)
                state.select_id = [];
        }
    }
})
