<template>
    <el-radio-group v-model="innerValue" v-on="$listeners" :disabled="disabled">
        <el-radio v-for="item in items" :key="item.value" :label="$dictKey(item.value, numeric)">{{
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
        dictKey: String,
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
            const items = this.data ? this.data : this.$getDict(this.dictKey);

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
        dictKey: 'resetValue',
        exclude() {
            this.$nextTick(() => {
                if (this.innerValue && !this.items.some(item => item.value == this.innerValue)) {
                    this.resetValue();
                }
            });
        },
    },
};
</script>
