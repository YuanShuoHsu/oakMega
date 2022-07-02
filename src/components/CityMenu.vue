<template>
    <div class="mapList">
        <CityMenuHeader />
        <CityMenuList />
    </div>
</template>

<script>
import CityMenuHeader from "./../components/CityMenuHeader";
import CityMenuList from "./../components/CityMenuList";

export default {
    name: "CityMenu",
    components: {
        CityMenuHeader,
        CityMenuList,
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
