<template>
  <ts-login :top-tab="toptab" :logo="logopic">
    <div class="ts-loginlabel username" style="margin-top:20px;">
      <input type="text" placeholder="请输入用户名" v-model="nameinput" />
    </div>
    <div class="ts-loginlabel password">
      <input type="password" placeholder="请输入密码" v-model="passwordinput" />
    </div>
    <div class="margintop50 ts-loginlabel">
      <el-button type="primary" @click="login">登录</el-button>
    </div>
  </ts-login>
</template>
<script>
import axion from '@/util/api.js'
export default {
  data() {
    return {
      logopic:'',
      checked: true,
      toptab: [{
        text: '账号登录'
      }],
      nameinput: '',
      passwordinput: '',
    }
  },
  mounted() {
    this.replacePic()
  },
  methods: {
    login(){
      if(this.nameinput == ''){
        this.$message({
          type:'warning',
          message:'请输入用户名'
        });
        return;
      }
      if(this.passwordinput == '') {
        this.$message({
          type:'warning',
          message:'请输入密码'
        });
        return;
      }
      let param = {
        userId:this.nameinput,
        password:this.passwordinput,
      }
      axion.login(param).then( res => {
        if(res.data.retCode == 0) {
          this.$message({
            type:'success',
            message:'登录成功'
          });
          sessionStorage.setItem("token",res.data.param.token);
          sessionStorage.setItem("phone",res.data.param.phone)
          sessionStorage.setItem("userId",res.data.param.user_id)
          this.$router.push('/statistic')
        } else {
          this.$message({
            type:'warning',
            message:res.data.retInfo
          })
        }
      })
    },
    //更换登录左边的图
    replacePic(){
      var div = document.querySelector(".ts-leftbg")
      var img = div.querySelector("img")
      img.src=""
    }
  }
}
</script>
<style lang="scss">
   .ts-logindiv{
     .ts-formdiv{ 
       .ts-inputdiv{
         left: 22%;
       }
     }
   }  
</style>