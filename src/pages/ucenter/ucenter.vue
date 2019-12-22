<template>
    <view class="center">
        <view class="logo">
            <view class="logo-img">
                <image :src="userInfo.avatar" />
            </view>
            <view class="logo-title">
                Hi，{{userInfo.nickName || ''}}
            </view>
        </view>
        <view class="center-list">
            <view class="center-list-item border-bottom">
                <view class="list-text">建议与反馈</view>
                <view class="list-item-icon">
                    <image src="../../static/arrow.png" />
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getUserInfo } from '@/services/common';
export default {
    data() {
        return {
            login: false,
            userInfo: {},
        };
    },
    async onLoad() {
        const { code, data, message } = await getUserInfo();
        this.userInfo = data;
    },
    methods: {
        goLogin() {
            if (!this.login) {
                console.log('点击前往登录');
            }
        },
    },
};
</script>

<style>

/* 解决头条小程序字体图标不显示问题，因为头条运行时自动插入了span标签，且有全局字体 */
/* #ifdef MP-TOUTIAO */
text :not(view) {
    font-family: texticons;
}

/* #endif */

.center {
    height: 100%;
    background-color: #F4F4F4;
    flex: 1;
    flex-direction: column;
}

.logo {
    width: 100%;
    background-color: #fff;
    height: 200upx;
    padding: 20upx;
    display: flex;
    margin-bottom: 30upx;
    align-items: center;
}

.logo-hover {
    opacity: 0.8;
}

.logo-img {
    width: 100upx;
    height: 100upx;
    border-radius: 100upx;
}

.logo-img image {
    height: 100%;
    width: 100%;
}

.logo-title {
    margin-left: 20upx;
}

.user-name {
    height: 60upx;
    line-height: 60upx;
    font-size: 38upx;
    color: #ffffff;
}

.go-login-navigat-arrow {
    font-size: 38upx;
    color: #ffffff;
}

.login-title {
    height: 150upx;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 20upx;
}

.center-list {
    flex-direction: column;
    background-color: #ffffff;
    padding-left: 20upx;
}

.center-list-item {
    height: 90upx;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.list-item-icon {
    height: 26upx;
    width: 16upx;
}

.list-item-icon image {
    height: 100%;
    width: 100%;
}

.border-bottom {
    border-bottom-width: 1upx;
    border-color: #c8c7cc;
    border-bottom-style: solid;
}

.list-text {
    height: 90upx;
    line-height: 90upx;
    font-size: 34upx;
    color: #555;
}

.navigat-arrow {
    height: 90upx;
    width: 40upx;
    line-height: 90upx;
    font-size: 34upx;
    color: #555;
    text-align: right;
    font-family: texticons;
}
</style>
