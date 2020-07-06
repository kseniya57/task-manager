<template>
    <ApolloQuery
            :query="PROJECT"
            :variables="{ id }"
            class="fullheight"
            v-color="'base'"
    >
        <template slot-scope="{ result: { loading, error, data } }">
            <div v-if="data" class="project df aic jcc fdc fullheight">
                <div
                        class="project__section"
                        v-color="'accent'"
                        v-text-color="'white'"
                        @click="go('design')"
                >
                    {{ text.menu.design }}
                </div>
                <div
                        class="project__section"
                        v-color="'accent'"
                        v-text-color="'white'"
                        @click="go('development')"
                >
                    {{ text.menu.development }}
                </div>
                <div
                        class="project__section"
                        v-color="'accent'"
                        v-text-color="'white'"
                        @click="go('seo')"
                >
                    {{ text.menu.seo }}
                </div>
                <div
                        class="project__section"
                        v-color="'accent'"
                        v-text-color="'white'"
                        @click="go('management')"
                >
                    {{ text.menu.management }}
                </div>
                <h3 class="text--lg text--bold" v-mb="3">{{ data.project.name }}</h3>
                <div class="df aic jcc" v-mb="2">
                    <ul class="df aic jcc fdc project__menu" v-mr="4">
                        <tooltip v-for="(icon, name) in menu.left" tag='li' :message="text.menu[name]" position="left" :key="name" @click="go(name)">
                            <v-icon :name="icon"/>
                        </tooltip>
                    </ul>
                    <v-image :src="data.project.image" class="project__image"/>
                    <ul class="df aic jcc fdc project__menu" v-ml="4">
                        <tooltip v-for="(icon, name) in menu.right" tag='li' :message="text.menu[name]" position="right" :key="name" @click="go(name)">
                            <v-icon :name="icon"/>
                        </tooltip>
                    </ul>
                </div>
                <p>{{ data.project.description }}</p>
            </div>
        </template>
    </ApolloQuery>

</template>

<script>
import { GQL_PROJECT } from '@/graphql';
import Tooltip from '@/components/Common/Tooltip';

export default {
  components: {
    Tooltip
  },
  data() {
    return {
      id: +this.$route.params.id,
      PROJECT: GQL_PROJECT
    };
  },
  methods: {
    go(name) {
      this.$router.push(`/projects/${this.id}/${name}`);
    }
  },
  computed: {
    menu() {
      return {
        left: {
          tasks: 'work',
          files: 'folder',
          settings: 'settings'
        },
        right: {
          members: 'group',
          attachments: 'attachment',
          apps: 'apps'
        }
      };
    }
  }
};
</script>

<style lang="sass" scoped>
    .project
        position: relative
        overflow: hidden
        &__image
            width: 40vw

        &__menu
            i
                font-size: 3rem
                cursor: pointer

            li:not(:last-child)
                margin-bottom: 3rem
        &__section
            position: absolute
            height: 4rem
            text-transform: capitalize
            display: flex
            align-items: center
            justify-content: center
            width: 50%
            cursor: pointer
            transition: $default-transition
            &:hover
                font-weight: bold
            &:nth-of-type(1)
                top: 15%
                left: 15%
                transform: translate(-50%, -50%) rotate(-45deg)
            &:nth-of-type(2)
                top: 15%
                right: 15%
                transform: translate(50%, -50%) rotate(45deg)
            &:nth-of-type(3)
                bottom: 15%
                left: 15%
                transform: translate(-50%, 50%) rotate(-135deg)
            &:nth-of-type(4)
                bottom: 15%
                right: 15%
                transform: translate(50%, 50%) rotate(135deg)
</style>
