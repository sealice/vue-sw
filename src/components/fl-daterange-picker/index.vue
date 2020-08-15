<template>
    <el-date-picker v-bind="defOptions" v-model="innerValue" v-on="$listeners"></el-date-picker>
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
        beforeDate: [String, Date],
        afterDate: [String, Date],
        value: Array,
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
            let pickerOptions = {};
            // eslint-disable-next-line no-unused-vars
            const { startTime, endTime, completionTime, beforeDate, afterDate, ...props } = this.$props;
            const toLocal = date => (typeof date === 'string' ? date.replace(/-/g, '/') : date);

            if (beforeDate || afterDate) {
                const now = new Date();
                pickerOptions = {
                    disabledDate(date) {
                        return (
                            (beforeDate && date < new Date(beforeDate == 'now' ? now - 864e5 : toLocal(beforeDate))) ||
                            (afterDate && date > new Date(afterDate == 'now' ? now : toLocal(afterDate)))
                        );
                    },
                };
            }

            props.pickerOptions = Object.assign(pickerOptions, props.pickerOptions);

            return props;
        },
        innerValue: {
            get() {
                if (this.value) {
                    return this.value;
                }

                return [this.startTime, this.endTime];
            },
            set(value) {
                let [startTime, endTime] = value || ['', ''];

                if (this.completionTime && this.type == 'daterange' && startTime && endTime) {
                    startTime += ' 00:00:00';
                    endTime += ' 23:59:59';
                }

                if (this.value) {
                    this.$emit('input', [startTime, endTime]);
                } else {
                    this.$emit('update:start-time', startTime);
                    this.$emit('update:end-time', endTime);
                }
            },
        },
    },
};
</script>