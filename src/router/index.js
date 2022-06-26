import VueRouter from "vue-router";
import SocialLogin from "./../pages/SocialLogin";
import NewTaipeiCity from "./../pages/NewTaipeiCity";

const router = new VueRouter({
    mode: "history",
    routes: [{
        path: '/',
        component: SocialLogin,
        meta: {
            isAuth: false,
        }
    }, {
        path: '/newTaipeiCity',
        component: NewTaipeiCity,
        meta: {
            isAuth: true,
        }
    }]
})

router.beforeEach((to, from, next) => {
    if (to.meta.isAuth) {
        if (localStorage.getItem("token")) {
            next();
        }
        else {
            alert("請先登入");
            next({
                path: "/"
            })
        }
    }
    else {
        if (localStorage.getItem("token")) {
            next({
                path: "/newTaipeiCity"
            })
        }
        else {
            next();
        }
    }
});

export default router;