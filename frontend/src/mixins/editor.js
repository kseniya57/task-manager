import { UPLOADS_URL } from '../constants';
import { VTextarea } from '@/components/Controls';
import { GQL_TAGS, GQL_USERS } from '@/graphql';

function getCaretPosition(el) {
  var start = 0,
    end = 0,
    normalizedValue,
    range,
    textInputRange,
    len,
    endRange;

  if (
    typeof el.selectionStart == 'number' &&
    typeof el.selectionEnd == 'number'
  ) {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    range = document.selection.createRange();

    if (range && range.parentElement() === el) {
      len = el.value.length;
      normalizedValue = el.value.replace(/\r\n/g, '\n');

      // Create a working TextRange that lives only in the input
      textInputRange = el.createTextRange();
      textInputRange.moveToBookmark(range.getBookmark());

      // Check if the start and end of the selection are at the very end
      // of the input, since moveStart/moveEnd doesn't return what we want
      // in those cases
      endRange = el.createTextRange();
      endRange.collapse(false);

      if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
        start = end = len;
      } else {
        start = -textInputRange.moveStart('character', -len);
        start += normalizedValue.slice(0, start).split('\n').length - 1;

        if (textInputRange.compareEndPoints('EndToEnd', endRange) > -1) {
          end = len;
        } else {
          end = -textInputRange.moveEnd('character', -len);
          end += normalizedValue.slice(0, end).split('\n').length - 1;
        }
      }
    }
  }

  return {
    start: start,
    end: end
  };
}

const actionKeysMap = {
  '@': 'users',
  '~': 'tags'
};

export default {
  components: {
    VTextarea
  },
  data: () => ({
    editor: null,
    position: 0,
    dropdownItems: [],
    searchText: null,
    users: [],
    tags: []
  }),
  apollo: {
    users: GQL_USERS,
    tags: GQL_TAGS
  },
  mounted() {
    this.editor = this.$refs.editor.$refs.textarea;
  },
  methods: {
    check(e) {
      if (actionKeysMap[e.key]) {
        this.dropdownItems = this[actionKeysMap[e.key]];
        const rect = this.editor.getBoundingClientRect();
        const characterWidth = 10.5;
        const numberOfLine =
          (this.position * characterWidth) / (rect.width - 18);
        this.$showContextMenu(
          {
            preventDefault: () => null,
            clientX:
              rect.x + ((this.position * characterWidth) % (rect.width - 18)),
            clientY: rect.y + 10 + 16 * (1 + numberOfLine)
          },
          'actions',
          {
            actions: this.dropdownItems.map(item => ({
              name: item.name,
              image: item.processed_avatar || item.image,
              action: () => this.insertTemplate(item.name + '#')
            }))
          }
        );
      }
      this.changePosition(e.key === 'Backspace' ? -1 : 1);
    },
    insertTemplate(template) {
      let positionIncrement = template.indexOf('#');
      const [textBeforeSelection, textAfterSelection] =
        this.value && this.value.length
          ? [
              this.value.substring(0, this.position),
              this.value.substring(this.position)
            ]
          : ['', ''];
      this.$emit(
        'input',
        textBeforeSelection + template.replace('#', '') + textAfterSelection
      );
      this.$nextTick(() => {
        this.editor.focus();
        this.editor.setSelectionRange(
          textBeforeSelection.length + positionIncrement,
          textBeforeSelection.length + positionIncrement
        );
      });
      this.changePosition(positionIncrement);
    },
    changePosition(value = 1) {
      if (value) {
        this.position += value;
      } else {
        this.position = getCaretPosition(this.editor).start;
      }
    },
    onUpload(fileName) {
      this.insertTemplate(`![#](${UPLOADS_URL + fileName})`);
    }
  }
};
