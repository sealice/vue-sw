<template>
    <el-date-picker v-bind="$props" v-model="innerValue"></el-date-picker>
</template>

<script>
import { DatePicker } from 'element-ui';

export default {
    name: 'FlDatePicker',
    components: {
        ElDatePicker: DatePicker,
    },
    props: {
        value: [String, Number, Array],
        format: String,
        align: String,
        readonly: Boolean,
        disabled: Boolean,
        pickerOptions: Object,
        editable: {
            type: Boolean,
            default: false,
        },
        clearable: {
            type: Boolean,
            default: true,
        },
        placeholder: {
            type: String,
            default: '选择日期',
        },
        type: {
            type: String,
            default: 'date',
            validator(value) {
                return ['year', 'month', 'date', 'dates', 'week', 'datetime'].indexOf(value) !== -1;
            },
        },
        valueFormat: {
            type: String,
            default() {
                const dateFormat = ['yyyy', 'MM', 'dd'];
                switch (this.type) {
                    case 'year':
                        return dateFormat[0];
                    case 'month':
                        return dateFormat[1];
                    case 'week':
                        return 'W';
                    case 'datetime':
                        return dateFormat.join('-') + ' HH:mm:ss';
                    default:
                        return dateFormat.join('-');
                }
            },
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
