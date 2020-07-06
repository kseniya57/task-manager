<template>
  <codemirror ref="codemirror" v-model="code" :options="opt" @input="$emit('change', code)"></codemirror>
</template>

<script>
import { codemirror } from 'vue-codemirror-lite';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/sass/sass.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/mode/shell/shell.js';
import 'codemirror/mode/vue/vue.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

export default {
  props: { file: { required: true }, height: { default: '90vh' } },
  components: {
    codemirror
  },
  mounted() {
    this.editor = this.$refs.codemirror.editor;
    this.$el
      .querySelector('.CodeMirror.CodeMirror-wrap')
      .setAttribute('height', this.height);
    this.editor.setOption('extraKeys', {
      Tab: () => {
        const c = this.editor.getCursor();
        const line = this.code
          .split('\n')
          [c.line].substring(0, c.ch)
          .split(/\s+/);
        const tag = line[line.length - 1];
        switch (this.file.ext) {
          case 'html':
            this.editor.replaceRange(
              `<${tag}></${tag}>`,
              { line: c.line, ch: c.ch - tag.length },
              c
            );
        }
      }
    });
  },
  data() {
    return {
      code: this.file.code,
      document: null,
      editor: null,
      opt: {
        mode: this.file.mode,
        styleActiveLine: true,
        tabSize: 2,
        lineWrapping: true,
        lineNumbers: true,
        // mixins not applied here, i don't know why => i used parent in this case
        theme: this.$parent.highlights.file,
        matchBrackets: true,
        viewportMargin: Infinity
      }
    };
  },
  watch: {
    text(value) {
      this.code = value;
    },
    file(f) {
      this.code = f.code;
      this.opt = { ...this.opt, mode: this.file.mode };
    }
  }
};
</script>

<style lang="sass">
  .CodeMirror.CodeMirror-wrap
    width: 90vw
    // height: 90vh
    overflow-y: auto
</style>
