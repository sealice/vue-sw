<template>
    <el-date-picker v-bind="defOptions" v-model="innerValue"></el-date-picker>
</template>

<script>
import { computed, mergeProps } from 'vue';

export default {
    name: 'FlDaterangePicker',
    inheritAttrs: false,
    props: {
        // 开始时间
        startTime: [String, Date],
        // 结束时间
        endTime: [String, Date],
        // 是否补全时间，开始时间补00:00:00，结束时间补23:59:59
        completionTime: Boolean,
        beforeDate: [String, Date],
        afterDate: [String, Date],
        width: String,
        // Original props
        modelValue: Array,
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
        // valueFormat: {
        //     type: String,
        //     default(props) {
        //         const dateFormat = ['yyyy', 'MM', 'dd'];
        //         switch (props.type) {
        //             case 'monthrange':
        //                 return dateFormat.slice(0, 2).join('-');
        //             case 'datetimerange':
        //                 return dateFormat.join('-') + ' HH:mm:ss';
        //             default:
        //                 return dateFormat.join('-');
        //         }
        //     },
        // },
    },
    setup(props, { attrs, emit }) {
        const isValue = 'modelValue' in props;
        const defOptions = computed(() => {
            /* eslint-disable no-unused-vars */

            const { startTime, endTime, completionTime, beforeDate, afterDate, width, ...options } = mergeProps(
                props,
                attrs
            );
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

        const innerValue = computed({
            get() {
                return isValue
                    ? props.modelValue
                    : props.startTime && props.endTime
                    ? [props.startTime, props.endTime].map(date => new Date(date))
                    : [];
            },
            set(value) {
                let [startTime, endTime] = value || ['', ''];

                if (props.completionTime && props.type == 'daterange' && startTime && endTime) {
                    startTime += ' 00:00:00';
                    endTime += ' 23:59:59';
                }

                if (isValue) {
                    emit('update:modelValue', [startTime, endTime]);
                } else {
                    emit('update:startTime', startTime);
                    emit('update:endTime', endTime);
                }
            },
        });

        return {
            defOptions,
            innerValue,
        };
    },
};
</script>
