<template>
    <el-radio-group v-model="innerValue" :disabled="disabled">
        <el-radio v-for="item in $getState(stateKey)" :key="item.value" :label="$stateKey(item.value, numeric)">{{
            item.label
        }}</el-radio>
    </el-radio-group>
</template>

<script>
import { RadioGroup, Radio } from 'element-ui';

export default {
    name: 'FlRadio',
    components: {
        ElRadioGroup: RadioGroup,
        ElRadio: Radio,
    },
    props: {
        value: [String, Number],
        stateKey: String,
        numeric: Boolean,
        disabled: Boolean,
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
