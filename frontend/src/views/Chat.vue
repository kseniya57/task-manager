<template>
  <div class="chat df">
    <div class="chat__sidebar" v-color="'white'">
      <div class="df aic jcsb chat__item">
        <v-input v-model="searchText" :placeholder="text.form.search"/>
        <v-button
            v-color="'accent'"
            type="circle"
            v-mr="1"
            @click="$showModal('chat', { chat: { users: [] } })"
        >
          <v-icon name="add" :color="'white'"/>
        </v-button>
      </div>
      <div
          class="chat__item group df fdc fww acfs pointer"
          v-color="currentChat && currentChat.id === item.id ? 'accent' : 'base'"
          v-text-color="currentChat && currentChat.id === item.id ? 'white' : 'dark'"
          v-for="item in filteredChats"
          @click="setCurrentChat(item)"
          @contextmenu="e => $showContextMenu(e, 'actions', getChatActionsMenuData(item))"
          :key="item.id"
      >
        <v-image class="group__image" :src="item.image" v-circle="4" v-mr="1"/>
        <div class="group__header df jcsb aic">
          <span class="group__name" v-mr=".5">{{ item.name }},</span>
          <span class="group__date text--xs" v-text-color="'text_light'"
                v-if="item.lastMessage">{{ item.lastMessage.created_at | date }}</span>
        </div>
        <div class="group__content" v-if="item.lastMessage">
          <span class="text--bold" v-mr=".5">{{ item.lastMessage.user.name }}:</span>
          <span>
                        {{ item.lastMessage.content | limit(10) }}
                    </span>
        </div>
      </div>
    </div>
    <div class="chat__content df fdc jcfe expanded ais" v-color="'white'">
      <transition name="fade">
        <div class="chat__messages-box expanded" v-if="currentChat" ref="chat" @wheel="onScroll">
          <div
              :class="`message df message--${user.id === message.user.id ? 'right' : 'left'}`"
              v-for="message in messages"
              v-mb=".5"
              @contextmenu.prevent="e => user.id === message.user.id ? $showContextMenu(e, 'actions', getActionsMenuData(message)) : null"
              :key="`message${message.id}`"
          >
            <v-image class="message__avatar asfe" :src="message.user.processed_avatar" v-circle="2"/>
            <div class="message__content df fdc">
              <markdown-renderer :value="message.content" v-mb=".5"/>
              <span class="message__date text--xs asfe"
                    v-text-color="'text_light'">{{ message.created_at | date }}</span>
            </div>
          </div>
        </div>
      </transition>
      <message-editor v-if="currentChat" v-model="currentMessage.content" @send="sendMessage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  GQL_CHATS,
  GQL_DELETE_CHAT,
  GQL_CHAT_ADDED,
  GQL_CHAT_UPDATED,
  GQL_CHAT_DELETED,
  GQL_ADD_MESSAGE,
  GQL_UPDATE_MESSAGE,
  GQL_DELETE_MESSAGE,
  GQL_MESSAGE_ADDED,
  GQL_MESSAGE_UPDATED,
  GQL_MESSAGE_DELETED,
  GQL_MESSAGES
} from '@/graphql';
import { VInput } from '@/components/Controls';
import scrollTo from '@/utils/scrollTo';
import mutator from '@/mixins/mutator';
import MarkdownRenderer from '../components/Services/MarkdownRenderer';
import MessageEditor from '../components/Common/MessageEditor';

export default {
  components: {
    MarkdownRenderer,
    VInput,
    MessageEditor
  },
  mixins: [mutator],
  data: () => ({
    currentChat: null,
    chats: [],
    searchText: '',
    currentMessage: {},
    messages: [],
    offset: 0,
    limit: 10
  }),
  apollo: {
    messages: {
      query: GQL_MESSAGES,
      variables() {
        return {
          filter: { chat_id: this.currentChat.id },
          pagination: {
            limit: this.limit,
            offset: this.offset,
            order: 'created_at'
          }
        };
      },
      update(result) {
        return this.offset === 0
          ? result.messages
          : result.messages.concat(this.messages);
      },
      skip() {
        return !this.currentChat;
      }
    },
    created() {
      this.$addSubscriptions('chat', {
        added: GQL_CHAT_ADDED,
        updated: GQL_CHAT_UPDATED,
        deleted: GQL_CHAT_DELETED,
        all: GQL_CHATS
      });
      this.$addSubscriptions(
        'message',
        {
          added: this.onMessageAdded,
          updated: GQL_MESSAGE_UPDATED,
          deleted: GQL_MESSAGE_DELETED,
          all: GQL_MESSAGES
        },
        null,
        false
      );
    }
    // $subscribe: {
    //   messageAdded: {
    //     query: GQL_MESSAGE_ADDED,
    //     result({data: {messageAdded}}) {
    //       if (messageAdded.chat_id === this.currentChat.id) {
    //         this.messages.push(messageAdded);
    //         this.currentChat.lastMessage = messageAdded;
    //         this.currentChat.totals.count++;
    //         this.scrollToLastMessage();
    //       }
    //     }
    //   },
    //   messageUpdated: {
    //     query: GQL_MESSAGE_UPDATED,
    //     result({data: {messageUpdated}}) {
    //       const oldMessage = this.messages.find(
    //         item => item.id === messageUpdated.id
    //       );
    //       if (oldMessage) {
    //         Object.assign(oldMessage, messageUpdated);
    //       }
    //     }
    //   },
    //   messageDeleted: {
    //     query: GQL_MESSAGE_DELETED,
    //     result({
    //              data: {
    //                messageDeleted: {id}
    //              }
    //            }) {
    //       const index = this.messages.findIndex(item => item.id === id);
    //       if (index !== -1) {
    //         this.$delete(this.messages, index);
    //         this.currentChat.totals.count--;
    //       }
    //     }
    //   }
    // }
  },
  computed: {
    ...mapGetters(['user']),
    filteredChats() {
      return this.chats.filter(chat => chat.name.startsWith(this.searchText));
    }
  },
  methods: {
    onScroll() {
      if (
        this.$refs.chat.scrollTop === 0 &&
        !this.$apollo.queries.messages.loading &&
        this.messages.length < this.currentChat.totals.count
      ) {
        this.offset += this.limit;
        this.$apollo.queries.messages.refetch();
      }
    },
    removeChat(chat) {
      this.mutate(
        GQL_DELETE_CHAT,
        {
          id: chat.id
        },
        'Chat',
        GQL_CHATS
      );
    },
    removeMessage(message) {
      this.mutate(
        GQL_DELETE_MESSAGE,
        {
          id: message.id
        },
        'Message',
        GQL_MESSAGES
      );
    },
    getActionsMenuData(message) {
      return {
        actions: [
          {
            name: 'edit',
            icon: 'edit',
            action: () => (this.currentMessage = message)
          },
          {
            name: 'delete',
            icon: 'delete',
            action: () => this.removeMessage(message)
          }
        ]
      };
    },
    getChatActionsMenuData(chat) {
      return {
        actions: [
          {
            name: 'edit',
            icon: 'edit',
            action: () => this.$showModal('chat', { chat })
          },
          {
            name: 'delete',
            icon: 'delete',
            action: () => this.removeChat(chat)
          }
        ]
      };
    },
    setCurrentChat(chat) {
      this.currentChat = chat;
      this.offset = 0;
      this.currentMessage = {};
      this.$apollo.queries.messages.refetch();
    },
    sendMessage() {
      this.mutate(
        this.currentMessage.id ? GQL_UPDATE_MESSAGE : GQL_ADD_MESSAGE,
        {
          input: {
            content: this.currentMessage.content,
            chat_id: this.currentChat.id
          },
          id: this.currentMessage.id
        },
        'Message',
        GQL_MESSAGES
      );
      this.currentMessage = {};
    },
    scrollToLastMessage() {
      this.$nextTick(() => scrollTo(this.$refs.chat));
    },
    onMessageAdded(after) {
      return {
        query: GQL_MESSAGE_ADDED,
        result({ data: { messageAdded } }) {
          if (messageAdded.chat_id === this.currentChat.id) {
            this.messages.push(messageAdded);
            this.currentChat.lastMessage = messageAdded;
            this.currentChat.totals.count++;
            this.scrollToLastMessage();
            after(this.messages);
          }
        }
      };
    }
  },
  watch: {
    messages() {
      this.scrollToLastMessage();
    }
  }
};
</script>

<style lang="sass" scoped>
  .chat
    height: 100%

    &__sidebar
      flex-basis: 20rem
      border-right: $devider
      height: 100%

    &__content
      overflow: hidden

    &__messages-box
      overflow-y: auto
      padding: 1.5rem

    &__item
      border-bottom: $devider

    .group
      height: 5rem
      padding: .5rem 1rem
      transition: $default-transition

      &__header
        flex-basis: 1.5rem

    .message
      &__content
        position: relative
        padding: 1rem
        background-color: $base
        border-radius: 1rem

        &::after
          content: ''
          bottom: 0
          position: absolute
          border: .5rem solid $base

      &--left
        .message__avatar
        margin-right: 1rem

        .message__content
          border-bottom-left-radius: 0

          &::after
            left: -1rem
            border-left-color: transparent
            border-top-color: transparent

      &--right
        flex-direction: row-reverse

        .message__avatar
          margin-left: 1rem

        .message__content
          border-bottom-right-radius: 0

          &::after
            right: -1rem
            border-right-color: transparent
            border-top-color: transparent
</style>
