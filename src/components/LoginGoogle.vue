<template>
    <div ref="customGoogleButton"></div>
</template>

<script>
export default {
    name: "LoginGoogle",
    mounted() {
        this.initGoogle();
    },
    methods: {
        initGoogle() {
            window.google.accounts.id.initialize({
                client_id:
                    "248599475462-d4qe5vcckbi7j3oilm0flhns92sonsg5.apps.googleusercontent.com",
                callback: this.handleCredentialResponse,
            });
            window.google.accounts.id.renderButton(
                this.$refs.customGoogleButton,
                { theme: "outline", size: "large", width: "240" }
            );
        },
        handleCredentialResponse(response) {
            const jwtToken = response.credential;
            localStorage.setItem("token", jwtToken);
            // const responsePayload = this.parseJwt(jwtToken);
            // console.log(responsePayload);
            this.$router.push({ path: "/newTaipeiCity" });
        },
        parseJwt(token) {
            let base64Url = token.split(".")[1];
            let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            let jsonPayload = decodeURIComponent(
                window
                    .atob(base64)
                    .split("")
                    .map(function (c) {
                        return (
                            "%" +
                            ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                        );
                    })
                    .join("")
            );
            return JSON.parse(jsonPayload);
        },
    },
};
</script>

<style scoped lang="scss">
</style>
