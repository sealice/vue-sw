<template>
    <el-select
        v-model="innerValue"
        v-on="$listeners"
        :style="style"
        :clearable="clearable"
        :disabled="disabled"
        :filterable="filterable"
        :placeholder="placeholder"
        :multiple="multiple"
        :value-key="valueKey"
        :collapse-tags="collapseTags"
    >
        <el-option
            v-for="item in items"
            :key="item.value"
            :value="isObject ? item : $dictKey(item.value, numeric)"
            :label="item.label"
        ></el-option>
    </el-select>
</template>

<script>
import { Select, Option } from 'element-ui';

export default {
    name: 'FlSelect',
    components: {
        ElSelect: Select,
        ElOption: Option,
    },
    props: {
        value: [String, Number, Array, Object],
        data: Array,
        width: String,
        exclude: [String, Number, Array],
        dictKey: String,
        numeric: Boolean,
        isObject: Boolean,
        filterable: Boolean,
        disabled: Boolean,
        multiple: Boolean,
        collapseTags: Boolean,
        valueKey: String,
        placeholder: String,
        clearable: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        innerValue: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
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
            this.innerValue = this.multiple ? [] : '';
        },
    },
    watch: {
        data: 'resetValue',
        dictKey: 'resetValue',
        exclude() {
            this.$nextTick(() => {
                if (this.innerValue && !this.items.some(item => item.value == this.innerValue)) {
                    this.resetValue();
                }
            });
        },
    },
};
</script>
