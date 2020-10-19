<template>
    <el-select v-on="$listeners" v-bind="$attrs" :style="style" :value="value" :multiple="multiple">
        <template v-for="item in items">
            <slot :item="item">
                <el-option
                    :key="item.value"
                    :value="isObject ? item : $dictKey(item.value, numeric)"
                    :label="item.label"
                ></el-option>
            </slot>
        </template>
    </el-select>
</template>

<script>
// import { Select, Option } from 'element-ui';

export default {
    // components: {
    //     ElSelect: Select,
    //     ElOption: Option,
    // },
    inheritAttrs: false,
    props: {
        data: Array,
        width: String,
        exclude: [String, Number, Array],
        dictKey: String,
        numeric: Boolean,
        isObject: Boolean,
        // Original props
        value: [String, Number, Array, Object],
        multiple: Boolean,
    },
    computed: {
        items() {
            const exclude = this.exclude ? [].concat(this.exclude) : false;
            const items = this.data ? this.data : this.$getDict(this.dictKey);

            return !exclude ? items : items.filter(item => !exclude.some(val => val == item.value));
        },
        style() {
            const width = this.width;
            if (width) {
                return { width: !Number(width) ? width : width + 'px' };
            }

            return {};
        },
    },
    methods: {
        resetValue() {
            this.$emit('input', this.multiple ? [] : '');
        },
    },
    watch: {
        items(list) {
            if (this.multiple) {
                if (this.value.some(value => list.some(item => item.value != value))) {
                    this.resetValue();
                }
            } else {
                if (this.value && !list.some(item => item.value == this.value)) {
                    this.resetValue();
                }
            }
        },
    },
};
</script>
