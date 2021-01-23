<template>
    <el-checkbox-group v-bind="$attrs" :model-value="modelValue">
        <template v-for="item in items">
            <slot v-bind="{ item, toKey }">
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
import { computed, watch } from 'vue';
import { dictKey, getDict } from '@/basal/dict';

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
        modelValue: Array,
        border: Boolean,
    },
    setup(props, { emit }) {
        const data = props.data ?? getDict(props.dictKey);
        const items = computed(() => {
            const exclude = props.exclude ? [].concat(props.exclude) : false;
            return !exclude ? data : data.filter(item => !exclude.some(val => val == item.value));
        });

        watch(items, list => {
            if (props.modelValue?.some(value => !list.some(item => item.value == value))) {
                emit('update:modelValue', []);
            }
        });

        return {
            items,
            toKey: dictKey,
        };
    },
};
</script>
