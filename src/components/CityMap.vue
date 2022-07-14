<template>
    <div v-show="!isLoading" class="map"></div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "CityMap",
    computed: {
        ...mapState("cityAbout", ["isLoading"]),
    },
};
</script>

<style scoped lang="scss">
.map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: -1;
    user-select: none;
}
</style>
