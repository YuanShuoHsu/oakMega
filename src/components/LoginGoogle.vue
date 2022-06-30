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

            this.$router.push({ path: "/newTaipeiCity" });
        },
    },
};
</script>

<style scoped lang="scss">
</style>
