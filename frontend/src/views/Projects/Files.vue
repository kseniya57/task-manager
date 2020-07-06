<template>
  <div class="files fullheight" v-color="'base'" v-if="repository && project">
    <div v-mb="1" class="files__toolbar">
      <div class="df">
        <v-icon @click="back(path[0])" name="home" color="text_light" v-mr="1"/>
        <div
            v-for="(item, i) in path"
            :key="item.name"
            class="pointer"
        >
          <span @click="back(item)" v-mr="1" v-text-color="'text_light'">{{ item.name }}</span>
          <v-icon name="forward" v-if="i !== path.length - 1" v-mr="1" color="text_light"></v-icon>
        </div>
      </div>
    </div>
    <div class="df aic jcsb" v-mb="1">
      <div class="df fww fdc project__info--main">
        <v-image :src="project.image" v-circle="6" v-mr="1" class="expanded"/>
        <h3 class="text--md text--bold">{{ repository.name }}</h3>
        <span class="text--light">{{ text.git.license }}</span>
      </div>
      <div>
        <div class="df aic jcfe" v-mb="1">
          <v-button v-color="'accent'" v-mr="1" @click="star">
            <v-icon name="star" v-mr=".5"/>
            {{ text.git.star }}
            <span v-ml="1">{{ repository.stars }}</span>
          </v-button>
          <v-button v-color="'primary'" v-mr="1">
            <v-icon name="usb" v-mr=".5"/>
            {{ text.git.fork }}
            <span v-ml="1" @click="fork">{{ repository.forks }}</span>
          </v-button>
          <v-button v-color="'secondary'" @click="clone">{{ text.git.clone }}</v-button>
        </div>

        <div v-mb="1" class="df aic jcfe">
            <span v-mr="2" class="dif aic">
                <v-icon name="usb" v-mr=".3" color="text_light"/>
                <span class="text--bold" v-mr=".3">{{ repository.commitsCount }}</span>
                <span v-text-color="'text_light'">{{ text.git.commits }}</span>
            </span>
          <span v-mr="2" class="dif aic">
                <v-icon name="usb" v-mr=".3" color="text_light"/>
                <span class="text--bold" v-mr=".3">{{ repository.branches.length }}</span>
                <span v-text-color="'text_light'">{{ text.git.branches }}</span>
            </span>
          <span v-mr="2" class="dif aic">
                <v-icon name="usb" v-mr=".3" color="text_light"/>
                <span class="text--bold" v-mr=".3">{{ repository.tagsCount }}</span>
                <span v-text-color="'text_light'">{{ text.git.tags }}</span>
            </span>
          <span class="dif aic">
                <v-icon name="folder" v-mr=".3" color="text_light"/>
                <span class="text--bold">{{ repository.size }}</span>
                <span v-text-color="'text_light'">MB {{ text.git.files }}</span>
            </span>
        </div>
      </div>
    </div>
    <div v-if="Object.keys(items).length">
      <color-progress :items="repository.extensions" v-mb="1"/>
      <div class="df jcsb aic" v-mb="1">
        <v-select
            :initialValue="repository.currentBranch"
            @select="() => null"
            :items="repository.branches"
        />
        <div>
          <v-button v-color="'secondary'" @click="download" v-mr="1">
            <v-icon name="cloud_upload" v-mr=".5"/>
            {{ text.git.download }}
          </v-button>
          <v-button v-color="'accent'" @click="showHistory">
            <v-icon name="history" v-mr=".5"/>
            {{ text.git.history }}
          </v-button>
        </div>
      </div>
      <div v-if="repository.lastCommit" class="df aic jcsb project__commit" v-mb="1" v-color="'white'">
        <div class="df fdc fww jcc project__commit-content">
          <v-image :src="repository.lastCommit.author.processed_avatar" v-mr=".9" class="expanded" v-circle="5"/>
          <span class="text--bold"> {{ repository.lastCommit.message }}</span>
          <span>{{ repository.lastCommit.author.name }}, {{ repository.lastCommit.date | date }}</span>
        </div>
        <v-button v-color="'gray'">
          {{ repository.lastCommit.id }}
          <v-icon name="file_copy" v-ml="1"/>
        </v-button>
      </div>
      <div class="df fww files__box" v-color="'white'">
        <div
            v-for="(fileOrDirectory, key) in items"
            :key="key"
            v-mr="1"
        >
          <div
              class="df fdc aic pointer"
              v-if="fileOrDirectory.name"
              @dblclick="read(fileOrDirectory)"
              @contextmenu="e => $showContextMenu(e, 'actions', getContextMenuActions(fileOrDirectory.name, fileOrDirectory.ext))"

          >
            <v-image
                v-circle="5"
                :local="true"
                :src="getFileImage(fileOrDirectory)"></v-image>
            <span class="text--light">{{ fileOrDirectory.name }}</span>
          </div>
          <div
              class="df fdc aic pointer"
              v-else-if="typeof key === 'string'"
              @dblclick="goToDirectory(key, fileOrDirectory)"
              @contextmenu="e => $showContextMenu(e, 'actions', getContextMenuActions(key, ''))"
          >
            <v-icon class="files__folder" color="secondary" name="folder"/>
            <span class="text--light">{{ key }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="files__instructions">
      <markdown-renderer :value="emptyRepositoryValue"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import { GQL_PROJECT, GQL_REPOSITORY } from '@/graphql';
import ColorProgress from '@/components/Common/ColorProgress';
import { VSelect } from '@/components/Controls';
import MarkdownRenderer from '@/components/Services/MarkdownRenderer';

export default {
  components: {
    ColorProgress,
    VSelect,
    MarkdownRenderer
  },
  data() {
    return {
      file: {},
      fileToEdit: null,
      items: null,
      path: [],
      projectId: +this.$route.params.id,
      repository: null,
      extensions: {
        sass: 'text/x-sass',
        html: 'text/html',
        js: 'text/javascript',
        mjs: 'text/javascript',
        css: 'text/css',
        json: 'application/json',
        php: 'text/x-php',
        sh: 'text/x-sh',
        sql: 'text/x-mysql',
        vue: 'text/x-vue'
      },
      image_extensions: ['jpg', 'jpeg', 'png', 'svg', 'gif']
    };
  },
  apollo: {
    project: {
      query: GQL_PROJECT,
      variables() {
        return { id: this.projectId };
      }
    },
    repository: {
      query: GQL_REPOSITORY,
      variables() {
        return {
          projectId: this.projectId,
          name: this.$route.params.name
        };
      },
      update(result) {
        this.items = result.gitRepository.files;
        this.path = [{ name: '', items: this.items }];
        return result.gitRepository;
      }
    }
  },
  computed: {
    ...mapGetters(['user']),
    emptyRepositoryValue() {
      const text = this.text.git.instructions;
      const repository = `http://localhost:9999/data/${this.projectId}/${
        this.repository.name
      }/${this.repository.name}.git`;
      return `${text.empty_repository}

${text.create}
\`\`\`bash
git clone ${repository}
cd test
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master
\`\`\`

${text.existing}
\`\`\`bash
cd existing_folder
git init
git remote add origin ${repository}
git add .
git commit -m "Initial commit"
git push -u origin master
\`\`\`

${text.existing_repository}
\`\`\`bash
cd existing_repo
git remote rename origin old-origin
git remote add origin ${repository}
git push -u origin --all
git push -u origin --tags
\`\`\``;
    }
  },
  methods: {
    params(name, ext = '') {
      return {
        path: this.formPath(name, ext),
        name: this.repository.name,
        projectId: this.projectId
      };
    },
    getFileImage(file) {
      return this.image_extensions.includes(file.ext)
        ? file.path
        : `files/${
            Object.keys(this.extensions).includes(file.ext) ||
            file.ext === 'mp4'
              ? file.ext
              : 'text'
          }.svg`;
    },
    goToDirectory(name, items) {
      this.path.push({ name, items });
      this.items = items;
    },
    back(item) {
      this.items = item.items;
      const index = this.path.findIndex(p => p.name === item.name);
      this.path.splice(index + 1, this.path.length - index - 1);
    },
    async read(file) {
      this.file = file;
      const { name, ext } = file;
      this.file.mode = this.extensions[ext];
      if (this.extensions[ext]) {
        if (!this.file.code) {
          this.file.code = await axios
            .post(
              `http://localhost:9999/file/read`,
              Object.assign({ hash: file.hash }, this.params(name))
            )
            .then(result => result.data.file);
        }
        this.$showModal('codeMirror', { file: this.file });
      }
    },
    formPath(fileName, ext) {
      return (
        this.path.map(i => i.name).join('/') +
        '/' +
        fileName +
        (ext ? `.${ext}` : '')
      );
    },
    removeFile(name, ext) {
      axios.post(`http://localhost:9999/file/remove`, this.params(name, ext));
      // TODO: REMOVE FROM ITEMS
      // this.items.splice(this.items.indexOf(``), 1);
    },
    fork() {},
    clone() {},
    star() {},
    async download() {
      await axios({
        url: 'http://localhost:9999/download',
        method: 'POST',
        responseType: 'blob',
        data: this.params(name)
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${this.repository.name}.zip`);
        document.body.appendChild(link);
        link.click();
      });
    },
    showHistory() {},
    getContextMenuActions(name, ext) {
      return {
        actions: [
          {
            name: 'edit',
            icon: 'edit',
            action: () => null
          },
          {
            name: 'delete',
            icon: 'delete',
            action: () => this.removeFile(name, ext)
          }
        ]
      };
    }
  }
};
</script>

<style lang="sass" scoped>
  .files
    padding: 1rem

    &__instructions
      overflow-y: auto
      height: calc(100% - #{$header-height} - 10rem)

    &__toolbar
      padding: 1rem

    &__box
      padding: 1rem
      border-radius: .6rem
      overflow-y: auto

    &__folder
      font-size: 5rem

    .project
      &__info
        &--main
          height: 6rem

      &__commit
        border-radius: 1rem
        padding: .5rem 1rem

        &-content
          height: 5rem
</style>
