<template>
    <div class="betterList">
        <ul>
            <span>{{ pullDownMessage }}</span>
            <CityMenuListItem
                v-for="stopObj in stopPullUpLoad"
                :key="stopObj.id"
                :stopObj="stopObj"
            />
            <span>{{ pullUpMessage }}</span>
        </ul>
    </div>
</template>

<script>
import CityMenuListItem from "./../components/CityMenuListItem";

import { mapState } from "vuex";

export default {
    name: "CityMenuList",
    components: { CityMenuListItem },
    computed: {
        ...mapState("cityAbout", [
            "pullDownMessage",
            "pullUpMessage",
            "stopPullUpLoad",
        ]),
    },
};
</script>

<style scoped lang="scss">
.betterList {
    position: relative;
    width: 100%;
    height: calc(100vh - 40px - 40px - 40px - 7.5px - 1px - 20px - 40px);
    overflow: hidden;
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        text-align: center;
        span {
            line-height: 50px;
            user-select: none;
        }
    }
}
</style>
