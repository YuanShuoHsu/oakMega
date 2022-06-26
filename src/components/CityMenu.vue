<template>
    <div v-show="hamburger && !isLoading" key="2" class="mapList">
        <CityMenuHeader />
        <CityMenuList
            :stopPullUpLoad="stopPullUpLoad"
            :stopLocation="stopLocation"
        />
    </div>
</template>

<script>
import CityMenuHeader from "./../components/CityMenuHeader";
import CityMenuList from "./../components/CityMenuList";

import { mapState } from "vuex";

export default {
    name: "CityMenu",
    components: {
        CityMenuHeader,
        CityMenuList,
    },
    props: ["stopPullUpLoad", "stopLocation"],
    computed: {
        ...mapState("cityAbout", ["isLoading", "hamburger"]),
    },
};
</script>

<style scoped lang="scss">
.mapList {
    position: fixed;
    top: 10px;
    left: 10px;
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(254, 254, 254, 0.8);
    border: 1px solid #e7d5c7;
    border-radius: 8px;
}
</style>
