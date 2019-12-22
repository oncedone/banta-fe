<template>
    <view class="login-page">
        <view class="header">
            <view class="logo"></view>
        </view>
        <view v-show="pageType === 'login'" class="login-box">
            <view class="input-item">
                <view class="phone-bar">
                    <input placeholder="输入手机号" @input="handleMobileInput" />
                </view>
            </view>
            <view class="input-item">
                <view class="phone-bar">
                    <input placeholder="输入验证码" @input="handleCodeInput" />
                    <view @click="handleGetCode" class="code-text">{{
                        isFetchCode ? `${remainSecond}s后重新获取` : '获取验证码'
                    }}</view>
                </view>
            </view>
            <view class="btn-item">
                <!-- <button class="login-btn" @click="handleLogin">登录</button> -->
                <button class="login-btn" lang="zh_CN" v-show="canIUseUserInfo" open-type="getUserInfo" @getuserinfo="handleLogin">
                    登录
                </button>
            </view>
        </view>
        <!-- <view>
			<view v-show="pageType === 'register'">
				已有账号，<view @click="handleChangeType('login')">去登录</view>
			</view>
			<view v-show="pageType === 'login'">
				还没有账号，<view @click="handleChangeType('register')">去注册</view>
			</view>
		</view> -->
    </view>
</template>

<script>
import request from '@/common/request';
import { getCode, getCodeLoginToken, signinOrUp } from '@/services/login';
import { isValidPhone } from '@/common/util';

const REMAIN_SECOND = 5;
export default {
    data() {
        return {
            wxCode: '',
            canIUseUserInfo: true,
            pageType: 'login', // 用短信验证码后，只用一个逻辑就行了
            code: '',
            mobile: '',
            isFetchCode: false,
            remainSecond: REMAIN_SECOND,
            assessToken: '',
        };
    },
    onLoad(res) {
        console.log(res);
    },
    onUnload() {},
    methods: {
        async wxLogin() {
            // 获取微信code, 服务端用于获取openid
            const [loginErr, loginRes] = await uni.login();
            const { code } = loginRes;
            this.wxCode = code;
        },
        handleChangeType(type) {
            this.pageType = type;
        },
        handleMobileInput(e) {
            this.mobile = e.target.value;
        },
        handleCodeInput(e) {
            this.code = e.target.value;
        },
        async handleGetCode(e) {
            console.log(this.mobile);
            if (!isValidPhone(this.mobile)) {
                uni.showToast({
                    title: '请输入正确的手机号码!',
                    icon: 'none',
                });
                return;
            }

            if (this.isFetchCode) {
                return;
            }

            this.isFetchCode = true;
            this.remainSecondInterval = setInterval(() => {
                let remainSecond = --this.remainSecond;
                if (remainSecond < 0) {
                    this.isFetchCode = false;
                    this.remainSecond = REMAIN_SECOND;
                    clearInterval(this.remainSecondInterval);
                } else {
                    this.remainSecond = remainSecond;
                }
            }, 1000);

            const { code, data, msg } = await getCode(this.mobile);

            if (code !== '0') {
                uni.showToast({
                    title: '验证码发送失败，请稍后再试~',
                    icon: 'none',
                });
            } else {
                uni.showToast({
                    title: '获取验证码成功！',
                    icon: 'none',
                });
            }
        },
        async handleLogin(userInfoRes) {
            // 获取用户信息
            console.log(userInfoRes);
            const { errMsg, userInfo } = userInfoRes.detail;
            // 可以通过userInfo判断有没有同意
            if (errMsg !== 'getUserInfo:ok') {
                // getUserInfo:fail auth deny
            }

            const { avatarUrl, gender, language, nickName, country, province, city } = userInfo;
            if (!isValidPhone(this.mobile)) {
                uni.showToast({
                    title: '请输入正确的手机号码!',
                    icon: 'none',
                });
                return;
            }

            if (!this.code || this.code.length !== 6) {
                uni.showToast({
                    title: '请输入正确的验证码!',
                    icon: 'none',
                });
                return;
            }

            const res = await getCodeLoginToken({ mobile: this.mobile, code: this.code });
            if (res.code !== '0') {
                uni.showToast({
                    title: res.msg,
                    icon: 'none',
                });
                return;
            }

            // 为了绑定三方信息
            await this.wxLogin();

            const wxUserInfo = {
                nickName: userInfo.nickName,
                avatar: userInfo.avatarUrl,
                gender: userInfo.gender,
                province: userInfo.province,
                city: userInfo.city,
                language: userInfo.language,
                country: userInfo.country,
            };

            const payload = { mobile: this.mobile, token: res.data.token, code: this.wxCode, ...wxUserInfo };
            const finalRes = await signinOrUp(payload);

            if (finalRes.code !== '0') {
                uni.showToast({
                    title: '登录失败，请稍后再试...',
                    icon: 'none',
                });
            } else {
                uni.reLaunch({
                    url: '/pages/home/home',
                });
            }
        },
    },
};
</script>

<style scoped>
.header {
    padding-top: 100upx;
}

.logo {
    width: 150rpx;
    height: 150rpx;
    background: url('../../static/app-icon.png') no-repeat center center;
    background-size: contain;
    margin: 0 auto;
}

.login-page .header {
    margin-bottom: 130upx;
}

.input-item {
    margin-bottom: 20upx;
}
.phone-bar,
.code-bar {
    border-bottom: 1upx solid rgba(151, 151, 151, 0.37);
    margin: 0 40upx;
    height: 80upx;
    display: flex;
}

.phone-bar {
    align-items: center;
    margin-bottom: 50upx;
}

.phone-bar input {
    flex: 1;
    font-size: 30upx;
}

.phone-bar .code-text {
    width: 220upx;
    font-size: 30upx;
    color: #e73626;
    letter-spacing: 0;
    text-align: center;
    line-height: 46upx;
}

.code-bar {
    font-size: 30upx;
}

.btn-item {
    margin-top: 90upx;
}

.login-btn {
    color: #fff;
    background: #e73626;
    border-radius: 9upx;
    border-radius: 9upx;
    margin: 0 40upx;
}
</style>
