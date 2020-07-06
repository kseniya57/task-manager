<template>
  <div class="design df ais">
    <div class="design__artboard expanded">
      <span class="line" :style="{ left: x1, right: x1}"></span>
      <span class="line" :style="{ top: y2, bottom: y2}"></span>
      <span class="line" :style="{ left: x2, right: x2}"></span>
      <span class="line" :style="{ top: y1, bottom: y2 }"></span>
      <span class="rect-line" :style="{ left: rect.left, top: rect.top, right: rect.right, marginTop: '-.1rem' }"></span>
      <span class="rect-line" :style="{ top: rect.top, left: rect.left, bottom: rect.bottom, marginLeft: '-.1rem'  }"></span>
      <span class="rect-line" :style="{ left: rect.left, bottom: rect.bottom, right: rect.right }"></span>
      <span class="rect-line" :style="{ top: rect.top, right: rect.right, bottom: rect.bottom }"></span>
      <object ref="artboard" type="image/svg+xml" :data="require('@/assets/sketch/Dashboard.svg')" @load="setDocument"></object>
      <!--<div v-if="file" ref="artboard" v-html="file"></div>-->
    </div>
    <div class="design__sidebar box">
      <div>
        <div class="design__editor-toolbar df aic jcsb" v-color="'dark'">
          <span v-text-color="'white'" class="text--lg text--bold">sass</span>
          <v-icon
              name="file_copy"
              v-text-color="'white'"
              class="pointer"
              @click="() => $copy(code.replace(/\t/g, '').replace(/.*\n/, ''))"></v-icon>
        </div>
        <code-mirror :file="{ code: this.code, mode: 'sass' }" class="design__editor" height="10rem" />
      </div>
    </div>
  </div>
</template>

<script>
import { CodeMirror } from '@/components/Modals';
import { UPLOADS_URL } from '@/constants';
// import axios from 'axios';

const attributesMapping = {
  ...['font-size'].reduce(
    (acc, item) =>
      Object.assign(acc, {
        [item]: (value, tag, previousValue) =>
          `${previousValue}\t${item}: ${Math.round(value * 100) / 100}px\n`
      }),
    {}
  ),
  id: (value, tag, previousValue) => previousValue + '',
  rx: (value, tag, previousValue) =>
    previousValue + `\tborder-radius: ${Math.round(value * 10) / 10}px\n`,
  fill: (value, tag, previousValue) =>
    previousValue + `\t${tag === 'text' ? '' : 'background-'}color: ${value}\n`,
  stroke: (value, tag, previousValue) =>
    previousValue + `\tborder: 1px solid ${value}\n`,
  'stroke-width': (value, tag, previousValue) =>
    previousValue.replace('border: 1px', `border: ${value}px`)
};

export default {
  components: {
    CodeMirror
  },
  data: () => ({
    document: null,
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    rect: {},
    code: '',
    src: `sketch/Dashboard/template.svg`,
    file: null
  }),
  // async mounted() {
  //   this.file = (await axios.post(`${UPLOADS_URL}/file`, { path: this.src })).data.file;
  //   setTimeout(this.setDocument.bind(this), 2000);
  // },
  methods: {
    setDocument() {
      this.document = this.$refs.artboard.contentWindow.document;
      const containerRect = this.document
        .querySelector('svg')
        .getBoundingClientRect();
      const yPercent = containerRect.height / 100;
      const xPercent = containerRect.width / 100;
      this.document.addEventListener('mouseover', e => {
        e.stopPropagation();
        const target = ['tspan', 'path'].includes(e.target.tagName)
          ? e.target.parentElement
          : e.target;
        const rect = target.getBoundingClientRect();
        this.rect = {
          top: Math.round((rect.top - containerRect.top) / yPercent) + '%',
          bottom:
            Math.round((containerRect.bottom - rect.bottom) / yPercent) + '%',
          left: Math.round((rect.left - containerRect.left) / xPercent) + '%',
          right: Math.round((containerRect.right - rect.right) / xPercent) + '%'
        };
      });
      this.document.addEventListener('click', e => {
        e.stopPropagation();
        const target =
          e.target.tagName === 'tspan' ? e.target.parentElement : e.target;
        const rect = target.getBoundingClientRect();
        const id = target.getAttribute('id');
        this.code = `.${id}\n\twidth: ${Math.round(rect.width * 100) /
          100}px\n\theight: ${Math.round(rect.height * 100) / 100}px\n`;
        this.code += Object.values(target.attributes).reduce(
          (acc, c) =>
            attributesMapping[c.name]
              ? attributesMapping[c.name](c.value, target.tagName, acc)
              : acc + '',
          ''
        );
        this.x1 = Math.round((rect.left - containerRect.left) / xPercent) + '%';
        this.x2 =
          Math.round((rect.left - containerRect.left + rect.width) / xPercent) +
          '%';
        this.y1 = Math.round((rect.top - containerRect.top) / yPercent) + '%';
        this.y2 =
          Math.round((rect.top - containerRect.top + rect.height) / yPercent) +
          '%';
      });
    }
  }
};
</script>

<style lang="sass" scoped>
  .design
    height: calc(100vh - #{$header-height} - .2rem)
    width: 100%

    .rect
      position: absolute
      border: .1rem solid $secondary
      z-index: 1

    .rect-line
      position: absolute
      background-color: $secondary
      &:nth-of-type(2n)
        width: .1rem
      &:nth-of-type(2n + 1)
        height: .1rem

    .line
      position: absolute
      display: block
      transition: all .05s
      z-index: 2

      &:nth-of-type(2n)
        left: 0
        width: 100%
        height: .1rem
        background-image: linear-gradient(to right, $accent 33%, rgba(255,255,255,0) 0%)
        background-position: bottom
        background-size: .3rem .1rem
        background-repeat: repeat-x

      &:nth-of-type(2n + 1)
        top: 0
        height: 100%
        width: .1rem
        background-image: linear-gradient($accent 33%, rgba(255,255,255,0) 0%)
        background-position: right
        background-size: .1rem .3rem
        background-repeat: repeat-y

    &__artboard
      position: relative
      &>object
        height: 100%
        width: 100%

    &__sidebar
      width: 30rem

    &__editor
      &-toolbar
        height: 4rem
        border-top: .6rem
        border-left: .6rem
        padding: 1rem .6rem
</style>
