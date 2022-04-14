<template>
    <el-select
        v-on="$listeners"
        v-bind="$attrs"
        :style="style"
        :value="value"
        :multiple="multiple"
        :value-key="valueKey"
        :loading="loading"
        @[focus]="updateDictData"
    >
        <template v-for="(item, index) in items">
            <slot v-bind="{ item, toKey, index }">
                <el-option
                    :key="item.value"
                    :value="isObject ? item : toKey(item[valueKey], numeric)"
                    :label="item.label"
                    :disabled="item.disabled"
                ></el-option>
            </slot>
        </template>
    </el-select>
</template>

<script>
import { toKey, getDict } from '@/filter/dict';

export default {
    name: 'FlSelect',
    inheritAttrs: false,
    props: {
        data: Array,
        width: [String, Number],
        exclude: [String, Number, Array],
        dictKey: String,
        numeric: Boolean,
        isObject: Boolean,
        focusUpdate: Boolean,
        // Original props
        value: [String, Number, Array, Object],
        multiple: Boolean,
        valueKey: { type: String, default: 'value' },
    },
    data() {
        return {
            loading: false,
            dictData: [],
        };
    },
    computed: {
        isFetch() {
            return !!this.dictData.fetch;
        },
        focus() {
            return this.focusUpdate ? 'focus' : null;
        },
        items() {
            const items = this.data || this.dictData;
            const exclude = this.exclude ? [].concat(this.exclude) : false;

            return !exclude ? items : items.filter(item => !exclude.some(val => val == item[this.valueKey]));
        },
        style() {
            const width = this.width;
            if (width) {
                return { width: isNaN(width) ? width : width + 'px' };
            }

            return null;
        },
    },
    methods: {
        toKey,
        resetValue() {
            this.$emit('input', this.multiple ? [] : '');
        },
        updateDictData() {
            const key = this.dictKey;
            if (key) {
                this.dictData = getDict(key);
            }
        },
    },
    watch: {
        dictKey: 'updateDictData',
        dictData(val) {
            if (this.isFetch) {
                this.loading = val.loading;
            }
        },
        items(list) {
            const { value, valueKey, isObject, multiple } = this;

            if (multiple) {
                if (value.some(val => !list.some(item => item[valueKey] == (isObject ? val[valueKey] : val)))) {
                    this.resetValue();
                }
            } else {
                if (value && !list.some(item => item[valueKey] == (isObject ? value[valueKey] : value))) {
                    this.resetValue();
                }
            }
        },
    },
    created() {
        if (!this.focusUpdate) {
            this.updateDictData();
        }
    },
};
</script>
