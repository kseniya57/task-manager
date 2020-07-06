<template>
    <div
        v-html="compiledMarkdown"
        ref="container"
        class="markdown"
        @click="onClick"
        @contextmenu.prevent="onContextmenu"
    ></div>
</template>

<script>
import marked from 'marked';
import Prism from 'prismjs';

const DEFAULT_LANG = 'javascript';
const DEFAULT_PRISM_LANG = Prism.languages[DEFAULT_LANG];

const code = function(code, lang, escaped) {
  const [prismLang, safetyLang] = Prism.languages[lang]
    ? [Prism.languages[lang], lang]
    : [DEFAULT_PRISM_LANG, DEFAULT_LANG];

  const highlighted = Prism.highlight(code, prismLang, safetyLang);

  if (![null, code].includes(highlighted)) {
    [escaped, code] = [true, highlighted];
  }

  if (!lang) {
    return `<pre><code>${escaped ? code : escape(code, true)}</code></pre>`;
  }

  const className = this.options.langPrefix + escape(lang, true);

  return `<pre class="${className}"><code class="${className}">${
    escaped ? code : escape(code, true)
  }</code></pre>\n`;
};

const image = function(href, _, text) {
  return href
    ? `<div class="df aic jcc"><img src="${href}" alt="${text}"></div>`
    : text;
};

export default {
  props: {
    value: { default: '', type: String }
  },
  data: () => ({
    renderer: new marked.Renderer()
  }),
  computed: {
    compiledMarkdown: function() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.renderer.checkedCheckboxCounter = 0;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.renderer.uncheckedCheckboxCounter = 0;
      return marked(this.value, {
        renderer: this.renderer,
        sanitize: true,
        breaks: true
      });
    }
  },
  methods: {
    onClick(e) {
      if (e.target.type === 'checkbox') {
        let index = 0;
        for (let i = 0; i < e.target.value; i++) {
          index = this.value.indexOf(
            `- [${e.target.checked ? ' ' : 'x'}]`,
            index
          );
        }
        if (index !== -1) {
          this.$emit(
            'input',
            this.value.substring(0, index + 3) +
              'x' +
              this.value.substring(index + 4)
          );
        }
      }
      const route = e.target.getAttribute('data-route');
      if (route) {
        this.$router.push(route);
        this.$closeModal();
      }
    },
    onContextmenu(e) {
      let tag = e.target.tagName.toLowerCase();
      if (!this.mdStyles[tag]) {
        tag = '.' + e.target.className;
      }
      if (this.mdStyles[tag]) {
        this.$showContextMenu(e, 'colorBox', {
          input: v => this.colorInput(v, tag)
        });
      }
    },
    setColors({ color, opacity = '00' }, tag) {
      this.$refs.container
        .querySelectorAll(tag)
        .forEach(
          item =>
            (item.style.backgroundColor = `${this.colors[color]}${opacity}`)
        );
    },
    colorInput(color, tag) {
      this.mdStyles[tag].color = color;
      this.setColors({ color, opacity: this.mdStyles[tag].opacity }, tag);
    }
  },
  created() {
    this.renderer.code = code;
    this.renderer.image = image;
    this.renderer.checkbox = function(checked) {
      return `<input type="checkbox" value="${
        checked
          ? this.checkedCheckboxCounter++
          : this.uncheckedCheckboxCounter++
      }" ${checked ? 'checked="" ' : ''}>`;
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.container.innerHTML = this.$refs.container.innerHTML
        .replace(/~(\w+)/g, '<span class="tag">$1</span>')
        .replace(
          /@([^\s<]+)/g,
          `<a class="link" data-route="/users/$1" onclick="() => this.$router.push('/users/$1')">$1</a>`
        );
      Object.entries(this.mdStyles).forEach(([tag, style]) => {
        this.setColors(style, tag);
      });
    });
  }
};
</script>
