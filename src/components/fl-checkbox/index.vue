<template>
    <el-checkbox-group v-on="$listeners" v-bind="$attrs" :value="value">
        <template v-for="item in items">
            <slot :item="item">
                <el-checkbox :key="item.value" :label="$dictKey(item.value, numeric)" :border="border">{{
                    item.label
                }}</el-checkbox>
            </slot>
        </template>
    </el-checkbox-group>
</template>

<script>
// import { CheckboxGroup, Checkbox } from 'element-ui';

export default {
    // components: {
    //     ElCheckboxGroup: CheckboxGroup,
    //     ElCheckbox: Checkbox,
    // },
    inheritAttrs: false,
    props: {
        data: Array,
        exclude: [String, Number, Array],
        dictKey: String,
        numeric: Boolean,
        // Original props
        value: Array,
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
            this.$emit('input', []);
        },
    },
    watch: {
        items(list) {
            if (this.value.some(value => list.some(item => item.value != value))) {
                this.resetValue();
            }
        },
    },
};
</script>
