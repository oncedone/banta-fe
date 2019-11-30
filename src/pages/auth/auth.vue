<template>
    <view class="center">
        <view class="title">
            banta
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
            @getphonenumber="binGetphonenumber"
        >
            微信账号快捷登录
        </button>
        <view class="login-txt">输入手机号登录/注册</view>
        <view v-show="showUpdateTip">请升级微信版本</view>
    </view>
</template>

<script>
import { oauth_login, login } from "@/common/login";

export default {
    data() {
        return {
            code: "",
            canIUseUserInfo: uni.canIUse("button.open-type.getUserInfo"),
            canIUsePhoneNumber: uni.canIUse("button.open-type.getPhoneNumber")
        };
    },
    computed: {
        showUpdateTip() {
            return !this.canIUseUserInfo || !this.canIUsePhoneNumber;
        }
    },
    async onLoad() {
        this.login();

        return;
        // uni.login({
        //     success: res => {
        //         var that = this;
        //         // 获取session接口
        //         wx.request({
        //             url: "",
        //             data: {
        //                 code: res.code
        //             },
        //             method: "POST",
        //             header: {
        //                 "Content-Type": "application/x-www-form-urlencoded"
        //             },
        //             success: function(res) {
        //                 that.setData({
        //                     sessionkey: res.data
        //                 });
        //             },
        //             fail: function(err) {
        //                 console.log(err);
        //             }
        //         });
        //     }
        // });
        if (!globalData.sessionKey) {
            const [err, res] = await uni.getSetting();

            // 没有授权过
            // if (!res.authSetting["scope.userInfo"]) {
            //     return uni.redirectTo({
            //         url: "/pages/auth/auth"
            //     });
            // }

            // 获取用户微信信息
            // const [userInfoErr, userInfoRes] = await uni.getUserInfo();
            // const { userInfo, encryptedData, iv, signature } = userInfoRes;
            // console.log(userInfo);
            // const {
            //     avatarUrl,
            //     gender,
            //     language,
            //     nickName,
            //     country,
            //     province,
            //     city
            // } = userInfo;

            // 获取微信code, 服务端用于获取openid
            // const [loginErr, loginRes] = await uni.login();
            // const { code } = loginRes;

            // 三方登录
            const oauthLoginRes = await oauth_login({
                type: 1, // 标识微信
                code,
                avatar: avatarUrl,
                gender,
                language,
                nickName,
                country,
                province,
                city
            });
            if (oauthLoginRes.code !== 0) {
                uni.showToast({
                    icon: "none",
                    title: oauthLoginRes.msg || ""
                });
            } else {
                uni.showToast({
                    title: oauthLoginRes.msg
                });
            }
        } else {
            const loginRes = await login();
        }
    },
    methods: {
        bindGetUserInfo(res) {
            console.log(res.detail);
            const {
                errMsg,
                userInfo,
                encryptedData,
                iv,
                signature,
                rawData
            } = res.detail;
            if (errMsg !== "getUserInfo:ok") return;
            const {
                avatarUrl,
                gender,
                language,
                nickName,
                country,
                province,
                city
            } = userInfo;
        },
        binGetphonenumber(res) {
            console.log(res.detail);
            const { errMsg, encryptedData, iv } = res.detail;
            if (errMsg !== "getPhoneNumber:ok") {
                return uni.redirectTo({
                    url: "/pages/login/login"
                });
            }
            uni.checkSession({
                success: () => {
                    //同意授权
                    wx.request({
                        method: "POST",
                        url: "http://api.oncedone.cn/oauth/login",
                        data: {
                            type: 1, // 标识微信
                            code: this.code,
                            mobile: 18515065589,
                            // encrypdata: encryptedData,
                            // ivdata: iv
                        },
                        header: {
                            "content-type": "application/json" // 默认值
                        },
                        success: res => {
                            console.log("解密成功");
                            console.log(res);
                            let phone = res.data.phoneNumber;
                            console.log(phone);
                        },
                        fail: function(res) {
                            console.log("解密失败~~~~~~~~~~~~~");
                            console.log(res);
                        }
                    });
                },
                fail: function() {
                    console.log("session_key 已经失效，需要重新执行登录流程");
                    that.login(); //重新登录
                }
            });
        },
        async login() {
            // 获取微信code, 服务端用于获取openid
            const [loginErr, loginRes] = await uni.login();
            const { code } = loginRes;
            this.code = code;
        }
    }
};
</script>

<style scoped>
.title {
    text-align: center;
    margin-top: 40upx;
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
