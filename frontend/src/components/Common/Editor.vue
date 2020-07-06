<template>
    <div class="editor">
        <div class="editor__toolbar df jcfe aic">
            <tooltip
                    v-for="(template, icon) in actions"
                    :key="icon"
                    tag='span'
                    :message="text.editor[icon]"
                    position="bottom"
                    @click="insertTemplate(template)"
            >
                <v-icon :name="icon" color="text_light" class="editor__icon"></v-icon>
            </tooltip>
            <tooltip
                tag='span'
                :message="text.editor.insert_emoticon"
                position="bottom"
                @click.stop="e => $showContextMenu(e, 'emojiBox', { input: emoji => insertTemplate(emoji + '#') })"
            >
                <v-icon name="insert_emoticon" color="text_light" class="editor__icon"></v-icon>
            </tooltip>
            <v-button @click="$emit('ok')" class="editor__ok" v-color="'accent'">OK</v-button>
        </div>
        <v-textarea
            class="editor__content fullwidth"
            ref="editor"
            :value="value"
            @input="v => $emit('input', v)"
            @keydown="check"
            @click="changePosition(0)"
        >
        </v-textarea>
        <div class="df jcfe">
            <v-icon
                @click="$openFileDialog(onUpload)"
                name="attachment"
                color="text_light"
                class="editor__icon editor__icon--bottom"></v-icon>
        </div>
    </div>
</template>

<script>
import Tooltip from '@/components/Common/Tooltip';
import editor from '@/mixins/editor';

export default {
  props: ['value'],
  inheritAttrs: false,
  components: {
    Tooltip
  },
  mixins: [editor],
  data() {
    return {
      actions: {
        format_bold: '**#**',
        format_italic: '*#*',
        format_quote: '> #',
        code: '`#`',
        check_box: '- [ ] #',
        list: '* ',
        table_chart: `| header | header |
| ------ | ------ |
| cell | cell |
| cell | cell | `,
        insert_link: '[](#)'
      }
    };
  }
};
</script>

<style lang="sass" scoped>
.editor
    border: $devider
    border-radius: .6rem
    overflow: hidden
    &__toolbar
        padding: .5rem
        border-bottom: $devider
    &__content
        min-height: 2rem
    &__icon
        cursor: pointer
        margin-right: .5rem
        font-size: 1.8rem
        &--bottom
            font-size: 2.4rem
</style>
