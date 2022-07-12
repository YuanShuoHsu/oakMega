<template>
    <div class="loginMeta">
        <div id="fb-root"></div>
        <div
            onlogin="checkLoginState();"
            class="fb-login-button"
            data-width="240"
            data-size="large"
            data-button-type="login_with"
            data-layout="default"
            data-auto-logout-link="false"
            data-use-continue-as="true"
        ></div>
        <div id="status"></div>
    </div>
</template>

<script>
export default {
    name: "LoginMeta",
    data() {
        return {
            txtHeader: {
                typ: "JWT",
                alg: "HS256",
            },
            txtPayload: null,
            txtSecret: "facebookToken",
        };
    },
    mounted() {
        this.initMeta();
    },
    methods: {
        initMeta() {
            window.FB.init({
                appId: "1085732649020412",
                cookie: true,
                xfbml: true,
                version: "v14.0",
            });
            window.FB.AppEvents.logPageView();
            window.checkLoginState = this.checkLoginState;
        },
        checkLoginState() {
            window.FB.getLoginStatus((response) => {
                this.statusChangeCallback(response);
            });
        },
        statusChangeCallback(response) {
            if (response.status === "connected") {
                window.FB.api(
                    "/me?fields=name,email,picture{url}",
                    (response) => {
                        response.picture = response.picture.data.url;

                        this.txtPayload = JSON.parse(JSON.stringify(response));
                        localStorage.setItem("token", this.createJWT());
                        this.$router.push({ path: "/newTaipeiCity" });
                    }
                );
            }
        },
        getBase64Encoded(rawStr) {
            let wordArray = window.CryptoJS.enc.Utf8.parse(rawStr);
            let result = window.CryptoJS.enc.Base64.stringify(wordArray);
            return result;
        },
        createJWT() {
            let base64Header = this.getBase64Encoded(
                JSON.stringify(this.txtHeader)
            );
            let base64Payload = this.getBase64Encoded(
                JSON.stringify(this.txtPayload)
            );
            let signature = window.CryptoJS.HmacSHA256(
                base64Header + "." + base64Payload,
                this.txtSecret
            );
            let base64sign = window.CryptoJS.enc.Base64.stringify(signature);
            let jwt = base64Header + "." + base64Payload + "." + base64sign;
            return jwt;
        },
    },
};
</script>

<style scoped lang="scss">
</style>
