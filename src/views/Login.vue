<template>
    <div>
        <p>
            <label for="" style="display: inline-block; width: 64px; text-align: right;">用户名：</label>
            <input v-model="username" type="text" />
        </p>
        <p>
            <label for="" style="display: inline-block; width: 64px; text-align: right;">密码：</label>
            <input v-model="password" type="password" />
        </p>
        <p>
            <button @click="submit">登录</button>
        </p>
    </div>
</template>

<script>
import { LOGIN } from '@/store/types';
let vm;
export default {
    beforeCreate() {
        vm = this;
    },
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        submit() {
            vm.$store
                .dispatch(LOGIN, {
                    username: vm.username,
                    password: vm.password,
                })
                .then(isLogin => {
                    if (isLogin) {
                        vm.$router.replace(vm.$route.query.redirect || '/');
                    }
                });
        },
    },
};
</script>
