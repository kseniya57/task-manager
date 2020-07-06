<template>
    <div>
        <div class="theme__styles df" v-color="'white'">
            <div class="theme__section">
                <h5 v-mb=".5" class="text--bold text--sm" v-font="'headers'" v-text-color="'text_dark'">{{ text.theme.fonts }}</h5>
                <div class="df aic" v-for="(value, key) in fonts" :key="key">
                    <span v-mr="1" style="width: 7rem">{{ text.theme[key] }}:</span>
                    <v-select
                            @select="(v) => setFont(key, v)"
                            :initialValue="value"
                            :items="allFonts"
                            :placeholder="text.theme[key]"
                            class="theme__select"
                    />
                </div>
            </div>
            <div class="theme__section">
                <h5 v-mb=".5" class="text--bold text--sm" v-font="'headers'" v-text-color="'text_dark'">{{ text.theme.highlight }}</h5>
                <div class="df aic" v-for="(value, key) in highlights" :key="key">
                    <span v-mr="1" style="width: 7rem">{{ text.theme[key] }}:</span>
                    <v-select
                            @select="(v) => setHighlightTheme(key, v)"
                            :initialValue="value"
                            :items="highlightsMapping[key]"
                            :placeholder="text.theme[key]"
                            class="theme__select"
                    />
                </div>
            </div>
        </div>
        <div class="df ais theme__colors">
            <div v-for="(color, key) in colors" :key="key" v-color="key" class="expanded theme__item df fdc aic jcc">
                <input :value="color" @input="(e) => setColor(key, e.target.value)" type="color" class="theme__control">
                <span class="theme__color-name text--sm" v-mb=".3">{{ text.theme[key] }}</span>
                <span class="ttu text--xs theme__color" v-text-color="'text_light'" @click.stop>{{ color }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { VSelect } from '@/components/Controls';
import theme, { allFonts, highlightsMapping } from '@/libs/theme';
import userProfileUpdater from '@/mixins/userProfileUpdater';

export default {
  components: {
    VSelect
  },
  mixins: [userProfileUpdater],
  data: () => ({
    allFonts,
    highlightsMapping
  }),
  methods: {
    setColor(key, value) {
      this.colors[key] = value;
    },
    setFont(key, value) {
      this.fonts[key] = value;
    },
    // theme.highlights will be applied only after reload !!!
    setHighlightTheme(key, value) {
      this.highlights[key] = value;
    },
    getUserInput() {
      return {
        theme: JSON.stringify(theme)
      };
    }
  }
};
</script>

<style lang="sass" scoped>
    .theme
        &__styles
            height: 15rem
        &__section
            padding: 1rem
            border-right: $devider
        &__colors
            height: 30vh

        &__item
            font-size: 1.6rem
            position: relative
            cursor: pointer
            padding: 0 1rem
            text-align: center

        &__control
            opacity: 0
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
            z-index: 5

        &__color
            user-select: all
            z-index: 10
            text-shadow: .01rem .01rem $white

            &-name
                text-shadow: .05rem .05rem $white

            &::selection
                background-color: $white
</style>
