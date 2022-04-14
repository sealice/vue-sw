<template>
    <el-upload
        v-bind="$attrs"
        :class="[isImageStyle ? 'avatar-uploader' : 'file-uploader']"
        :action="action"
        :show-file-list="false"
        :http-request="elUpload"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
    >
        <slot>
            <template v-if="isImageStyle">
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </template>
            <template v-else>
                <el-input :value="value" readonly>
                    <el-button slot="append">选择文件</el-button>
                </el-input>
            </template>
        </slot>
    </el-upload>
</template>

<script>
import { elUpload } from '@/utils/assist';

export default {
    name: 'FlUpload',
    inheritAttrs: true,
    props: {
        value: String,
        isImageStyle: Boolean,
        action: {
            type: String,
            default: 'https://jsonplaceholder.typicode.com/posts',
        },
        fileType: [Array, String],
        fileTypeMessage: String,
        maxFileSize: {
            type: Number,
            default: 2, // MB
        },
    },
    data() {
        return {
            imageUrl: this.value,
        };
    },
    methods: {
        elUpload,
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.$emit('input', res.data);
        },
        beforeAvatarUpload(file) {
            let fileType = [].concat(this.fileType || []);
            const imgTypes = ['jpeg', 'jpg', 'png'];

            if (!fileType.length && this.isImageStyle) {
                fileType = imgTypes;
            }

            if (fileType.length && !fileType.some(item => file.type.indexOf(item) > -1)) {
                this.$message.error(this.fileTypeMessage || `只能上传 ${fileType} 格式!`);
                return;
            }

            if (this.maxFileSize && file.size / 1024 / 1024 > this.maxFileSize) {
                this.$message.error(`上传大小不能超过 ${this.maxFileSize}MB!`);
                return;
            }

            return true;
        },
    },
};
</script>

<style lang="less">
.file-uploader .el-upload {
    width: 100%;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
}

.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
}

.avatar {
    width: 150px;
    height: 150px;
    display: block;
}
</style>
