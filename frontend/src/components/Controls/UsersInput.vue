<template>
    <div class="users-input df fww" v-color="'white'" @keydown.delete="removeLastUser" v-if="allUsers.length">
        <div v-for="user in users" v-mr="1" class="users-input__item dif aic jcc" v-color="'gray'" :key="user.id">
            <v-image v-circle="2.5" :src="user.processed_avatar" v-mr=".5"/>
            <span v-mr="1">{{ user.name }}</span>
            <!--<span v-ml="1" class="users-input__role" v-text-color="'white'">role</span>-->
            <v-icon
                    name="close"
                    class="dif aic jcc pointer"
                    v-circle="1.3"
                    v-ml="1"
                    size="xxs"
                    v-color="'white'"
                    @click="remove(user.id)"></v-icon>
        </div>
        <v-select
                slot="activator"
                v-model="searchText"
                @select="add"
                :items="filteredUsers"
                :closeOnSelect="true"
                :clearOnSelect="true"
                v-text-color="'text_light'"
                imageField="processed_avatar"
        ></v-select>
    </div>
</template>

<script>
import { VSelect } from '@/components/Controls';
import { GQL_USERS } from '@/graphql';

export default {
  model: {
    prop: 'users',
    event: 'input'
  },
  props: { users: { required: true }, except: Number | [Number] },
  components: {
    VSelect
  },
  data() {
    return {
      allUsers: [],
      searchText: '',
      exclude: Array.isArray(this.except) ? this.except : [this.except]
    };
  },
  apollo: {
    allUsers: {
      query: GQL_USERS,
      update(data) {
        return data.users.filter(user => !this.exclude.includes(user.id));
      }
    }
  },
  methods: {
    add(user) {
      this.$emit('input', this.users.concat(user));
    },
    remove(id) {
      this.$emit('input', this.users.filter(user => user.id !== id));
    },
    removeLastUser() {
      if (!this.searchText.length) {
        if (this.users.length) {
          this.remove(this.users[this.users.length - 1].id);
        }
      }
    }
  },
  computed: {
    filteredUsers() {
      return this.allUsers.filter(
        user => !this.users.find(u => u.id === user.id)
      );
    }
  }
};
</script>

<style lang="sass" scoped>
.users-input
    border-radius: .6rem
    padding: 1rem
    &__item
        height: 3.5rem
        border-radius: .6rem
        padding: 0 .5rem

</style>
