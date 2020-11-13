<template>
    <el-date-picker v-on="$listeners" v-bind="defOptions"></el-date-picker>
</template>

<script>
const _assign = Object.assign;

export default {
    name: 'FlDatePicker',
    inheritAttrs: false,
    props: {
        beforeDate: [String, Date],
        afterDate: [String, Date],
        width: String,
        // Original props
        value: [String, Number, Array],
        pickerOptions: Object,
        editable: {
            type: Boolean,
            default: false,
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
        defOptions() {
            let pickerOptions = {};
            const { beforeDate, afterDate, width, ...props } = this.$props;
            const toLocal = date => (typeof date === 'string' ? date.replace(/-/g, '/') : date);

            if (width) {
                props.style = { width: !Number(width) ? width : width + 'px' };
            }

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

            props.pickerOptions = _assign(pickerOptions, props.pickerOptions);

            return _assign(props, this.$attrs);
        },
    },
};
</script>
