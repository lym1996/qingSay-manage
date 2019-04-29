<template>
  <div class="ts-wrapper" :class="{hideSidebar:isCollapse}">
    <ts-sidebar :collapsevalue="isCollapse" :routeMenu="routeMenu" :logo="logo" :simpleLogo="simplelogo"></ts-sidebar>
    <ts-navbar :userInfo="userInfo" :userMenu="userMenu"  :default-active="activeIndex" @sidebarHide="hideside" @userItemClick="useritemclick">
      <router-view></router-view>
    </ts-navbar>
  </div>
</template>
<script>
import { sideRoutes } from '@/router/routes.js'
import userphoto from '@/assets/logo.png'
import axion from '@/util/api.js'
// import logo from '@/assets/img/default/hosLogo.png'
// import simplelogo from '@/assets/img/default/simplelogo.png'
// const ifnew = window.location.href.indexOf('new');
export default {
  data() {
    return {
      token:sessionStorage.getItem('token'),
      isCollapse: false,
      routeMenu: sideRoutes,
      userInfo: {
        userphoto: userphoto,
        username: '个人中心'
      },
      userMenu: [{
        text: '退出'
      }],
      activeIndex: '1',
      logo:userphoto,
      simplelogo:userphoto,
      modifyDialog:false,
      //输入的密码
      modify:{
        oldPassword:'',
        newPassword:'',
        newPassword2:''
      },
      //调接口的参数
      setPasswordPrams:{
        password:'',
        newPassword:''
      },
      rules:{
        newPassword: [
          {
            pattern: /^[\w]{6,16}$/,
            message:"请输入6-16位密码只可包含数字字母"
          }
        ]
      }
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    hideside(isCollapse) {
      this.isCollapse = isCollapse
    },
    useritemclick(i) {
      if (i.text == '退出') {
        let param = {
          token:this.token
        }
        axion.logout(param).then(res => {
          if(res.data.retCode == 0) {
            this.$message(`您选择了${i.text}`)
            sessionStorage.clear();
            this.$router.push('/')
          }
        })
      }
    },
    getUserInfo(){
        let param = {
            token:this.token
        }
        axion.getUserInfo(param).then( res => {
            if(res.data.retCode == 0) {
                this.userInfo.userphoto = 'http://192.168.1.101:8515/img/getPicture?path='+res.data.param.profilePic
                console.log('11',this.userInfo.profilePic)
            }else if(res.data.retCode == 50004) {
                sessionStorage.removeItem('user_token');
                this.$router.push({ path:'/'})
            }
        })
    },
  }
}
</script>
