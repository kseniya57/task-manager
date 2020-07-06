<template>
    <input
            hidden
            ref="input"
            type="file"
            name="file"
            :disabled="isSaving"
            @change="filesChange($event.target.name, $event.target.files[0])"
    >
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import { UPLOADS_URL } from '@/constants';

const statuses = Object.freeze({
  INITIAL: 0,
  SAVING: 1,
  SUCCESS: 2,
  FAILED: 3
});

export default {
  data() {
    return {
      uploadError: null,
      currentStatus: statuses.INITIAL,
      onUpload: null
    };
  },
  computed: {
    isSaving() {
      return this.currentStatus === statuses.SAVING;
    }
  },
  created() {
    Vue.prototype.$openFileDialog = this.open;
  },
  methods: {
    async save(formData) {
      this.currentStatus = statuses.SAVING;
      try {
        const { data } = await axios.post(`${UPLOADS_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (this.onUpload && typeof this.onUpload === 'function') {
          this.onUpload(data.fileName);
        }
        this.currentStatus = statuses.SUCCESS;
      } catch (e) {
        this.uploadError = e.response;
        this.currentStatus = statuses.FAILED;
      }
    },
    open(onUpload) {
      this.$refs.input.click();
      this.onUpload = onUpload;
    },
    filesChange(fieldName, file) {
      const formData = new FormData();
      if (!file) return;
      formData.append(fieldName, file, file.name);
      this.save(formData);
    }
  }
};
</script>
