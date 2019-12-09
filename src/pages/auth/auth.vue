<template>
    <view class="center">
        <view class="header">
            <view class="logo"></view>
            <view class="title">办他</view>
        </view>
        <!-- <button
            v-show="canIUseUserInfo"
            open-type="getUserInfo"
            @getuserinfo="bindGetUserInfo"
        >
            授权获取信息
        </button> -->
        <button
            class="wx-login-btn"
            v-show="canIUsePhoneNumber"
            open-type="getPhoneNumber"
            @getphonenumber="bindGetphonenumber"
        >
            微信账号快捷登录
        </button>
        <view class="login-txt" @click="handlePhoneLogin">输入手机号登录/注册</view>
        <view v-show="showUpdateTip">请升级微信版本</view>
    </view>
</template>

<script>
import { oauthLogin, login } from '@/services/login';

export default {
    data() {
        return {
            code: '',
            canIUseUserInfo: uni.canIUse('button.open-type.getUserInfo'),
            canIUsePhoneNumber: uni.canIUse('button.open-type.getPhoneNumber'),
        };
    },
    computed: {
        showUpdateTip() {
            return !this.canIUseUserInfo || !this.canIUsePhoneNumber;
        },
    },
    async onLoad() {
        return;
    },
    methods: {
        handlePhoneLogin() {
            uni.navigateTo({
                url: '/pages/login/login',
            });
        },
        bindGetUserInfo(res) {
            console.log(res.detail);
            const { errMsg, userInfo, encryptedData, iv, signature, rawData } = res.detail;
            if (errMsg !== 'getUserInfo:ok') return;
            const { avatarUrl, gender, language, nickName, country, province, city } = userInfo;
        },
        async bindGetphonenumber(res) {
            console.log(res.detail);
            const { errMsg, encryptedData, iv } = res.detail;
            if (errMsg !== 'getPhoneNumber:ok') {
                return uni.redirectTo({
                    url: '/pages/login/login',
                });
            }

            await this.login(); // 为了拿到code

            const oauthLoginRes = oauthLogin({
                type: 1, // 标识微信
                code: this.code,
                encrypted: encryptedData,
                iv: iv,
            });

            // 必须先检查一下wx的session有没有过期
            // uni.checkSession({
            //     success: () => {},
            //     fail: function() {
            //         console.log('session_key 已经失效，需要重新执行登录流程');
            //         that.login(); //重新登录
            //     },
            // });
        },
        async login() {
            // 获取微信code, 服务端用于获取openid
            const [loginErr, loginRes] = await uni.login();
            const { code } = loginRes;
            this.code = code;
        },
    },
};
</script>

<style scoped>
.header {
    padding-top: 170upx;
}

.logo {
    width: 150upx;
    height: 150upx;
    background: url('../../static/app-icon.jpg') no-repeat center center;
    background-size: contain;
    margin: 0 auto;
}

.title {
    text-align: center;
    color: #222;
    line-height: 56upx;
    margin-top: 15upx;
    margin-bottom: 40upx;
}

.wx-login-btn {
    height: 94upx;
    line-height: 94upx;
    background: #e73626;
    margin: 0 40upx 20upx;
    color: #fff;
    font-size: 36upx;
}

.login-txt {
    text-align: center;
    color: #888888;
    font-size: 30upx;
}
</style>
