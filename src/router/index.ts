import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
    history: createWebHistory("/"),
    routes: [
        {
            path: '/',
            component: () => import("@/views/index/index.vue"),
            name: 'indexpage'
        }
    ]
})