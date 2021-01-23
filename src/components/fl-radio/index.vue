<template>
    <el-radio-group v-bind="$attrs" :model-value="modelValue">
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
import { computed, watch } from 'vue';
import { dictKey, getDict } from '@/basal/dict';

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
        modelValue: [String, Number],
        border: Boolean,
    },
    setup(props, { emit }) {
        const data = props.data ?? getDict(props.dictKey);
        const items = computed(() => {
            const exclude = props.exclude ? [].concat(props.exclude) : false;
            return !exclude ? data : data.filter(item => !exclude.some(val => val == item.value));
        });

        watch(items, list => {
            if (props.modelValue && !list.some(item => item.value == props.modelValue)) {
                emit('update:modelValue', '');
            }
        });

        return {
            items,
            toKey: dictKey,
        };
    },
};
</script>
