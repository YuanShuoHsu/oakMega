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
    mounted() {
        this.initMeta();
    },
    methods: {
        initMeta() {
            window.FB.init({
                appId: "5383669928358992",
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
                console.log(response);
            });
        },
        statusChangeCallback(response) {
            if (response.status === "connected") {
                window.FB.api(
                    "/me?fields=name,email,picture{url}",
                    (response) => {
                        response.picture = response.picture.data.url;
                        console.log(response);
                    }
                );
                // this.$router.push({ path: "/newTaipeiCity" });
            }
        },
    },
};
</script>

<style scoped lang="scss">
</style>
