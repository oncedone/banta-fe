<script>
import { oauth_login, login } from "./common/login";

export default {
    globalData: {},
    onLaunch: async function() {
        const globalData = getApp();

        if (!globalData || !globalData.sessionKey) {
            const [err, res] = await uni.getSetting();
            if (res.authSetting["scope.userInfo"]) {
                const oauthloginRes = await oauth_login();

            } else {
                uni.redirectTo("/pages/auth/auth");
            }
        } else {
            const loginRes = await login();
        }
    },
    onShow: function() {
        console.log("App Show");
    },
    onHide: function() {
        console.log("App Hide");
    }
};
</script>

<style>
/*每个页面公共css */
</style>
