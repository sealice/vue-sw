<template>
    <el-date-picker v-bind="defOptions" v-model="innerValue"></el-date-picker>
</template>

<script>
import { DatePicker } from 'element-ui';

export default {
    name: 'FlDaterangePicker',
    components: {
        ElDatePicker: DatePicker,
    },
    props: {
        // 开始时间，需使用sync修饰符
        startTime: {
            type: [String, Number],
            default: '',
        },
        // 结束时间，需使用sync修饰符
        endTime: {
            type: [String, Number],
            default: '',
        },
        // 是否补全时间，开始时间补00:00:00，结束时间补23:59:59
        completionTime: Boolean,
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
        startPlaceholder: {
            type: String,
            default: '开始日期',
        },
        endPlaceholder: {
            type: String,
            default: '结束日期',
        },
        type: {
            type: String,
            default: 'daterange',
            validator(value) {
                return ['monthrange', 'daterange', 'datetimerange'].indexOf(value) !== -1;
            },
        },
        valueFormat: {
            type: String,
            default() {
                const dateFormat = ['yyyy', 'MM', 'dd'];
                switch (this.type) {
                    case 'monthrange':
                        return dateFormat.slice(0, 2).join('-');
                    case 'datetimerange':
                        return dateFormat.join('-') + ' HH:mm:ss';
                    default:
                        return dateFormat.join('-');
                }
            },
        },
    },
    computed: {
        defOptions() {
            const props = Object.assign({}, this.$props);
            delete props.startTime;
            delete props.endTime;
            delete props.completionTime;
            return props;
        },
        innerValue: {
            get() {
                return [this.startTime, this.endTime];
            },
            set(value) {
                let [startTime, endTime] = value || ['', ''];

                if (startTime && endTime && this.completionTime && this.type == 'daterange') {
                    startTime += ' 00:00:00';
                    endTime += ' 23:59:59';
                }

                this.$emit('update:start-time', startTime);
                this.$emit('update:end-time', endTime);
            },
        },
    },
};
</script>
