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
export default {
    name: 'FlButton',
    inheritAttrs: false,
    props: {
        loading: Boolean,
        disabled: Boolean,
        loadingAtSubmit: Boolean,
    },
    data() {
        return { isSubmit: false };
    },
    methods: {
        onClick(event) {
            if ('submit' in this.$listeners) {
                this.isSubmit = true;
                const cb = () => {
                    this.isSubmit = false;
                };
                this.$emit('submit', cb, event);
            } else {
                this.$emit('click', event);
            }
        },
    },
};
</script>
