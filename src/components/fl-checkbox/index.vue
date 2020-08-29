<template>
    <el-checkbox-group v-model="innerValue" v-on="$listeners" :disabled="disabled" :min="min" :max="max">
        <el-checkbox v-for="item in items" :key="item.value" :label="$dictKey(item.value, numeric)">{{
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
        data: Array,
        exclude: [String, Number, Array],
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
        items() {
            const exclude = this.exclude ? [].concat(this.exclude) : false;
            const items = this.data ? this.data : this.$getDict(this.stateKey);

            return !exclude ? items : items.filter(item => !exclude.some(val => val == item.value));
        },
    },
    methods: {
        resetValue() {
            this.innerValue = [];
        },
    },
    watch: {
        data: 'resetValue',
        stateKey: 'resetValue',
    },
};
</script>
