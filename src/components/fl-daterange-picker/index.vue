<template>
    <el-date-picker
        v-on="$listeners"
        v-bind="defOptions"
        :value="innerValue"
        @[input]="val => (innerValue = val)"
    ></el-date-picker>
</template>

<script>
const _assign = Object.assign;

export default {
    name: 'FlDaterangePicker',
    inheritAttrs: false,
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
        width: [String, Number],
        // Original props
        value: Array,
        pickerOptions: Object,
        editable: {
            type: Boolean,
            default: false,
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
                const { type, completionTime } = this;
                const dateFormat = ['yyyy', 'MM', 'dd'];
                switch (true) {
                    case type === 'monthrange':
                        return dateFormat.slice(0, 2).join('-');
                    case type === 'datetimerange' || completionTime:
                        return dateFormat.join('-') + ' HH:mm:ss';
                    default:
                        return dateFormat.join('-');
                }
            },
        },
        defaultTime: {
            type: Array,
            default() {
                if (this.completionTime) {
                    return ['00:00:00', '23:59:59'];
                }
            },
        },
    },
    computed: {
        input() {
            let event = 'input';

            if (event in this.$listeners) {
                event = null;
            }

            return event;
        },
        defOptions() {
            let pickerOptions = {};
            // eslint-disable-next-line no-unused-vars
            const { startTime, endTime, completionTime, beforeDate, afterDate, width, ...props } = this.$props;
            const toLocal = date => (typeof date === 'string' ? date.replace(/-/g, '/') : date);

            if (width) {
                props.style = { width: isNaN(width) ? width : width + 'px' };
            }

            if (beforeDate || afterDate) {
                const now = new Date();
                pickerOptions = {
                    disabledDate(date) {
                        return (
                            (afterDate && date < new Date(afterDate == 'now' ? now - 864e5 : toLocal(afterDate))) ||
                            (beforeDate && date > new Date(beforeDate == 'now' ? now : toLocal(beforeDate)))
                        );
                    },
                };
            }

            props.pickerOptions = _assign(pickerOptions, props.pickerOptions);

            return _assign(props, this.$attrs);
        },
        innerValue: {
            get() {
                if (this.input) {
                    return [this.startTime, this.endTime];
                }

                return this.value;
            },
            set(value) {
                if (this.input) {
                    let [startTime, endTime] = value || ['', ''];
                    this.$emit('update:start-time', startTime);
                    this.$emit('update:end-time', endTime);
                }
            },
        },
    },
};
</script>
