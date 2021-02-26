<template>
    <div style="margin: 0 auto; padding: 50px 0; width: 520px;">
        <p>
            <label for="" style="display: inline-block; width: 64px; text-align: right;">用户名：</label>
            <input v-model="form.username" type="text" />
        </p>
        <p>
            <label for="" style="display: inline-block; width: 64px; text-align: right;">密码：</label>
            <input v-model="form.password" type="password" />
        </p>
        <p>
            <button @click="submit">登录</button>
        </p>
    </div>
</template>

<script>
import { reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { LOGIN } from '@/store/types';

export default {
    setup() {
        const router = useRouter();
        const route = useRoute();
        const store = useStore();
        const form = reactive({});

        const submit = () => {
            store.dispatch(LOGIN, form).then(isLogin => {
                if (isLogin) {
                    router.replace(route.redirectedFrom?.fullPath || '/');
                }
            });
        };

        return {
            form,
            submit,
        };
    },
};
</script>
