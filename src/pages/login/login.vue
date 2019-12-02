<template>
    <view class="login-wrapper">
        <view v-show="pageType === 'login'" class="login-box">
            <view class="input-item">
                <view class="phone-bar">
                    <input placeholder="输入手机号" :value="mobile" />
                </view>
            </view>
            <view class="input-item">
                <view class="code-bar">
                    <input :value="password" placeholder="输入验证码" />
                </view>
            </view>
            <view class="btn-item">
                <button class="login-btn" @click="handleLogin">登录</button>
            </view>
        </view>
		<view v-show="pageType === 'register'" class="register-box">
            <view class="input-item">
                <view class="phone-bar">
                    <input placeholder="输入手机号" :value="mobile" />
                    <view @click="handleGetCode" >获取验证码</view>
                </view>
            </view>
            <view class="input-item">
                <view class="code-bar">
                    <input :value="code" placeholder="输入验证码" />
                </view>
            </view>
            <view class="btn-item">
                <button class="login-btn" @click="handleLogin">注册</button>
            </view>
        </view>
		<view>
			<view v-show="pageType === 'register'">
				已有账号，<view @click="handleChangeType('login')">去登录</view>
			</view>
			<view v-show="pageType === 'login'">
				还没有账号，<view @click="handleChangeType('register')">去注册</view>
			</view>
		</view>
    </view>
</template>

<script>
import request from '@/common/request';

export default {
	data() {
		return {
			pageType: 'register',
			code: '',
			mobile: '',
		}
	},
	onLoad(res) {
		console.log(res);
	},
    methods: {
		handleChangeType(type) {
			this.pageType = type;
			/*
				Set-Cookie: banta_access_token=uaGO6NoFr9SlIH+KLYM5nWk82nxmelEm; Max-Age=2147483647; Expires=Thu, 18-Dec-2087 20:21:16 GMT; Path=/
				Set-Cookie: openid=ozbmm5B_8g-XVHwPUt9R5Nq4mKcc; Max-Age=2147483647; Expires=Thu, 18-Dec-2087 20:21:16 GMT; Path=/
				Set-Cookie: session_key=6r1qtPPBc2Y5Yp3FnkQWRw==; Max-Age=2147483647; Expires=Thu, 18-Dec-2087 20:21:16 GMT; Path=/
			*/
		},
        handleGetCode(e) {
			console.log();
			wx.request({
				url: 'http://api.oncedone.cn/login',
				methods: 'POST',
				data: {
					mobile: '',
				},
				success({ data, statusCode, header }) {
					
				},
				error() {

				}
			});

        },
        handleLogin(e) {}
    }
};
</script>

<style scoped>
.login-wrapper {
    margin-top: 400upx;
}
.input-item {
    margin-bottom: 20upx;
}
.phone-bar,
.code-bar {
    border-bottom: 1upx solid rgba(151, 151, 151, 0.37);
	margin: 0 40upx;
}

.phone-bar {
    display: flex;
    align-items: center;
	margin-bottom: 50upx;
}

.phone-bar input {
    flex: 1;
	font-size: 30upx;
}

.phone-bar view {
    width: 200upx;
    font-size: 30upx;
    color: #5496e3;
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
