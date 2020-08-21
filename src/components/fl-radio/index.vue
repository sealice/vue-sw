<template>
    <el-radio-group v-model="innerValue" v-on="$listeners" :disabled="disabled">
        <el-radio v-for="item in items" :key="item.value" :label="$stateKey(item.value, numeric)">{{
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
        data: Array,
        exclude: [String, Number, Array],
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
        items() {
            const exclude = this.exclude ? [].concat(this.exclude) : false;
            const items = this.data ? this.data : this.$getState(this.stateKey);

            return !exclude ? items : items.filter(item => !exclude.some(val => val == item.value));
        },
    },
    methods: {
        resetValue() {
            this.innerValue = '';
        },
    },
    watch: {
        data: 'resetValue',
        stateKey: 'resetValue',
    },
};
</script>
