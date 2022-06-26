<template>
    <div v-show="!isLoading" id="map"></div>
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
#map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    user-select: none;
    z-index: -1;
}
</style>
