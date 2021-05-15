<template>
    <el-button
        v-bind="$attrs"
        :loading="loading || (isSubmit && loadingAtSubmit)"
        :disabled="disabled || (isSubmit && !loadingAtSubmit)"
        @click="onClick"
    >
        <slot></slot>
    </el-button>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'FlButton',
    emits: ['click'],
    inheritAttrs: false,
    props: {
        loading: Boolean,
        disabled: Boolean,
        loadingAtSubmit: Boolean,
    },
    setup(props, { emit, attrs }) {
        const isSubmit = ref(false);
        const onClick = event => {
            const { onSubmit } = attrs;
            if (onSubmit) {
                isSubmit.value = true;
                const cb = () => {
                    isSubmit.value = false;
                };
                onSubmit(cb, event);
            } else {
                emit('click', event);
            }
        };

        return {
            isSubmit,
            onClick,
        };
    },
};
</script>
