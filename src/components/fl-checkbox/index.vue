<template>
    <el-checkbox-group v-on="$listeners" v-bind="$attrs" :value="value">
        <template v-for="(item, index) in items">
            <slot v-bind="{ item, toKey, index }">
                <component
                    :is="buttonGroup ? 'el-checkbox-button' : 'el-checkbox'"
                    :key="item.value"
                    :label="toKey(item.value, numeric)"
                    :border="border"
                    :disabled="item.disabled"
                    >{{ item.label }}</component
                >
            </slot>
        </template>
    </el-checkbox-group>
</template>

<script>
import { toKey, getDict } from '@/filter/dict';

export default {
    name: 'FlCheckbox',
    inheritAttrs: false,
    props: {
        data: Array,
        exclude: [String, Number, Array],
        dictKey: String,
        numeric: Boolean,
        buttonGroup: Boolean,
        // Original props
        value: Array,
        border: Boolean,
    },
    data() {
        return {
            dictData: [],
        };
    },
    computed: {
        items() {
            const items = this.data || this.dictData;
            const exclude = this.exclude ? [].concat(this.exclude) : false;

            return !exclude ? items : items.filter(item => !exclude.some(val => val == item.value));
        },
    },
    methods: {
        toKey,
        resetValue() {
            this.$emit('input', []);
        },
        updateDictData() {
            const key = this.dictKey;
            if (key) {
                this.dictData = getDict(key);
            }
        },
    },
    watch: {
        dictKey: {
            immediate: true,
            handler: 'updateDictData',
        },
        items(list) {
            if (this.value.some(value => !list.some(item => item.value == value))) {
                this.resetValue();
            }
        },
    },
};
</script>
