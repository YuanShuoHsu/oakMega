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
            this.googleAccounts().then(() => {
                window.google.accounts.id.initialize({
                    client_id:
                        "266526655758-dqfkv8305d2bgbrmo7ijlnnu6484ciqq.apps.googleusercontent.com",
                    callback: this.handleCredentialResponse,
                });
                window.google.accounts.id.renderButton(
                    this.$refs.customGoogleButton,
                    { theme: "outline", size: "large", width: "240" }
                );
            });
        },
        async googleAccounts() {
            let result = await new Promise((resolve) => {
                let interval = setInterval(() => {
                    if (window.google !== undefined) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 200);
            });
            return result;
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
