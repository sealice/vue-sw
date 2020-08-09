<template>
    <el-select
        v-model="innerValue"
        :clearable="clearable"
        :disabled="disabled"
        :filterable="filterable"
        :placeholder="placeholder"
        :multiple="multiple"
        :collapse-tags="collapseTags"
    >
        <el-option
            v-for="item in $getState(stateKey)"
            :key="item.value"
            :value="$stateKey(item.value, numeric)"
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
        value: [String, Number, Array],
        stateKey: String,
        numeric: Boolean,
        filterable: Boolean,
        disabled: Boolean,
        multiple: Boolean,
        collapseTags: Boolean,
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
    },
};
</script>
