<template>
    <el-select v-bind="$attrs" :style="style" :model-value="modelValue" :value-key="valueKey" :multiple="multiple">
        <template v-for="item in items">
            <slot v-bind="{ item, toKey }">
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
import { computed, watch } from 'vue';
import { dictKey, getDict } from '@/basal/dict';

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
        modelValue: [String, Number, Array, Object],
        multiple: Boolean,
        valueKey: { type: String, default: 'value' },
    },
    setup(props, { emit }) {
        const data = props.data ?? getDict(props.dictKey);
        const resetValue = () => emit('update:modelValue', props.multiple ? [] : '');

        const items = computed(() => {
            const exclude = props.exclude ? [].concat(props.exclude) : false;
            return !exclude ? data : data.filter(item => !exclude.some(val => val == item[props.valueKey]));
        });

        const style = computed(() => {
            const width = props.width;
            if (width) {
                return { width: !Number(width) ? width : width + 'px' };
            }

            return {};
        });

        watch(items, list => {
            if (props.multiple) {
                if (
                    props.modelValue?.some(value => {
                        return !list.some(item => {
                            return item[props.valueKey] == (props.isObject ? value[props.valueKey] : value);
                        });
                    })
                ) {
                    resetValue();
                }
            } else {
                if (
                    props.modelValue &&
                    !list.some(item => {
                        return (
                            item[props.valueKey] ==
                            (props.isObject ? props.modelValue?.[props.valueKey] : props.modelValue)
                        );
                    })
                ) {
                    resetValue();
                }
            }
        });

        return {
            items,
            style,
            toKey: dictKey,
        };
    },
};
</script>
