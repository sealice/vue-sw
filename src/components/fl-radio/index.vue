<template>
    <el-radio-group v-on="$listeners" v-bind="$attrs" :value="value">
        <template v-for="item in items">
            <slot :item="item">
                <el-radio :key="item.value" :label="$dictKey(item.value, numeric)" :border="border">{{
                    item.label
                }}</el-radio>
            </slot>
        </template>
    </el-radio-group>
</template>

<script>
// import { RadioGroup, Radio } from 'element-ui';

export default {
    // components: {
    //     ElRadioGroup: RadioGroup,
    //     ElRadio: Radio,
    // },
    inheritAttrs: false,
    props: {
        data: Array,
        exclude: [String, Number, Array],
        dictKey: String,
        numeric: Boolean,
        // Original props
        value: [String, Number],
        border: Boolean,
    },
    computed: {
        items() {
            const exclude = this.exclude ? [].concat(this.exclude) : false;
            const items = this.data ? this.data : this.$getDict(this.dictKey);

            return !exclude ? items : items.filter(item => !exclude.some(val => val == item.value));
        },
    },
    methods: {
        resetValue() {
            this.$emit('input', '');
        },
    },
    watch: {
        items(list) {
            if (this.value && !list.some(item => item.value == this.value)) {
                this.resetValue();
            }
        },
    },
};
</script>
