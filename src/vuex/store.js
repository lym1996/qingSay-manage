import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        jumpUrl:'http://localhost:8080#/articleContent?'
    }
})
 export default store