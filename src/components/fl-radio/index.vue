<template>
    <el-radio-group v-on="$listeners" v-bind="$attrs" :value="value">
        <template v-for="item in items">
            <slot v-bind="{ item, toKey }">
                <component
                    :is="buttonGroup ? 'el-radio-button' : 'el-radio'"
                    :key="item.value"
                    :label="toKey(item.value, numeric)"
                    :border="border"
                    :disabled="item.disabled"
                    >{{ item.label }}</component
                >
            </slot>
        </template>
    </el-radio-group>
</template>

<script>
import { dictKey, getDict } from '@/filter/dict';

export default {
    name: 'FlRadio',
    inheritAttrs: false,
    props: {
        data: Array,
        exclude: [String, Number, Array],
        dictKey: String,
        numeric: Boolean,
        buttonGroup: Boolean,
        // Original props
        value: [String, Number],
        border: Boolean,
    },
    computed: {
        items() {
            const items = this.data || getDict(this.dictKey);
            const exclude = this.exclude ? [].concat(this.exclude) : false;

            return !exclude ? items : items.filter(item => !exclude.some(val => val == item.value));
        },
    },
    methods: {
        toKey: dictKey,
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
