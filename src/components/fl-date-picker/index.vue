<template>
    <el-date-picker v-bind="defOptions"></el-date-picker>
</template>

<script>
import { computed, mergeProps } from 'vue';

export default {
    name: 'FlDatePicker',
    inheritAttrs: false,
    props: {
        beforeDate: [String, Date],
        afterDate: [String, Date],
        width: String,
        // Original props
        modelValue: [String, Date],
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
        // valueFormat: {
        //     type: String,
        //     default(props) {
        //         const dateFormat = ['yyyy', 'MM', 'dd'];
        //         switch (props.type) {
        //             case 'year':
        //                 return dateFormat[0];
        //             case 'month':
        //                 return dateFormat[1];
        //             case 'week':
        //                 return 'W';
        //             case 'datetime':
        //                 return dateFormat.join('-') + ' HH:mm:ss';
        //             default:
        //                 return dateFormat.join('-');
        //         }
        //     },
        // },
    },
    setup(props, { attrs }) {
        const defOptions = computed(() => {
            const { beforeDate, afterDate, width, ...options } = mergeProps(props, attrs);
            const toLocal = date => (typeof date === 'string' ? date.replace(/-/g, '/') : date);

            if (width && !options.style) {
                options.style = { width: !Number(width) ? width : width + 'px' };
            }

            if (beforeDate || afterDate) {
                const now = new Date();
                options.disabledDate = function disabledDate(date) {
                    return (
                        (afterDate && date < new Date(afterDate == 'now' ? +now - 864e5 : toLocal(afterDate))) ||
                        (beforeDate && date > new Date(beforeDate == 'now' ? now : toLocal(beforeDate)))
                    );
                };
            }

            return options;
        });

        return {
            defOptions,
        };
    },
};
</script>
