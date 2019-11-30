<script>
import { oauth_login, login } from "./common/login";

export default {
    globalData: {
        sessionKey: uni.getStorageSync("sessionKey"),
        userInfo: null
    },
    onLaunch: async function() {
        let globalData = this.$scope.globalData;

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
