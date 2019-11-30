<template>
  <view class="center">
    <button v-if="canIUse" open-type="getUserInfo" bindgetuserinfo="bindGetUserInfo">授权登录</button>
    <view v-else>请升级微信版本</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      canIUse: true
    };
  },
  methods: {
    bindGetUserInfo(res) {
      console.log(res);
    }
  }
};
</script>

<style>
</style>
