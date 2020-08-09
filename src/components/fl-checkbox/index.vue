<template>
    <el-checkbox-group v-model="innerValue" :disabled="disabled" :min="min" :max="max">
        <el-checkbox v-for="item in $getState(stateKey)" :key="item.value" :label="$stateKey(item.value, numeric)">{{
            item.label
        }}</el-checkbox>
    </el-checkbox-group>
</template>

<script>
import { CheckboxGroup, Checkbox } from 'element-ui';

export default {
    name: 'FlCheckbox',
    components: {
        ElCheckboxGroup: CheckboxGroup,
        ElCheckbox: Checkbox,
    },
    props: {
        value: Array,
        stateKey: String,
        numeric: Boolean,
        disabled: Boolean,
        min: Number,
        max: Number,
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
