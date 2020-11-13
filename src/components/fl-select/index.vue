<template>
    <el-select
        v-on="$listeners"
        v-bind="$attrs"
        :style="style"
        :value="value"
        :multiple="multiple"
        :value-key="valueKey"
    >
        <template v-for="item in items">
            <slot v-bind="{ item, toKey }">
                <el-option
                    :key="item.value"
                    :value="isObject ? item : toKey(item[valueKey], numeric)"
                    :label="item.label"
                ></el-option>
            </slot>
        </template>
    </el-select>
</template>

<script>
import { dictKey, getDict } from '@/filter/dict';

export default {
    name: 'FlSelect',
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
        valueKey: { type: String, default: 'value' },
    },
    computed: {
        items() {
            const items = [].concat(this.data || getDict(this.dictKey));
            const exclude = this.exclude ? [].concat(this.exclude) : false;

            return !exclude ? items : items.filter(item => !exclude.some(val => val == item[this.valueKey]));
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
        toKey: dictKey,
        resetValue() {
            this.$emit('input', this.multiple ? [] : '');
        },
    },
    watch: {
        items(list) {
            if (this.multiple) {
                if (
                    this.value.some(
                        value =>
                            !list.some(item => item[this.valueKey] == (this.isObject ? value[this.valueKey] : value))
                    )
                ) {
                    this.resetValue();
                }
            } else {
                if (
                    this.value &&
                    !list.some(item => item[this.valueKey] == (this.isObject ? this.value[this.valueKey] : this.value))
                ) {
                    this.resetValue();
                }
            }
        },
    },
};
</script>
