<template>
    <view>
        <view v-show="loading">loading</view>
        <button v-show="showUserInfo" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">
            请求获取用户信息
        </button>
    </view>
</template>

<script>
import { updateUser } from '@/services/user';
export default {
    data() {
        return {
            loading: true,
            canIUseUserInfo: uni.canIUse('button.open-type.getUserInfo'),
            hasAuthUserInfo: true,
        };
    },
    computed: {
        showUserInfo() {
            return this.canIUseUserInfo && !this.hasAuthUserInfo;
        },
    },
    async onLoad() {
        const globalData = getApp().globalData;
        if (!globalData.sessionKey) {
            this.handleNoSession();
        } else {
            this.handleSession();
        }
    },
    methods: {
        handleNoSession() {
            uni.navigateTo({
                url: '/pages/auth/auth',
            });
        },
        async handleSession() {
            const [err, res] = await uni.getSetting();

            // 没有授权过
            if (!res.authSetting['scope.userInfo']) {
                this.hasAuthUserInfo = false;
                this.loading = false;
                return;
            }

            const [userInfoErr, userInfoRes] = await uni.getUserInfo();
            const { userInfo, encryptedData, iv, signature } = userInfoRes;

            this.updatUserInfo(userInfo);
        },
        bindGetUserInfo(res) {
            console.log(res.detail);
            if (errMsg !== 'getUserInfo:ok') return;
            const { errMsg, userInfo, encryptedData, iv, signature, rawData } = res.detail;
            this.updatUserInfo(userInfo);
        },
        async updatUserInfo(userInfo) {
            const { avatarUrl, gender, language, nickName, country, province, city } = userInfo;
            const { code, data, msg } = await updateUser({
                nickName,
                avatar: avatarUrl,
                gender,
                province,
                city,
                language,
                country,
            });
            this.loading = false;

            if (code !== '0') {
                uni.showToast({
                    title: msg,
                    icon: 'none',
                });
                uni.redirectTo({
                    url: '/pages/auth/auth',
                });
            } else {
                uni.switchTab({
                    url: '/pages/home/home',
                });
            }
        },
    },
};
</script>
