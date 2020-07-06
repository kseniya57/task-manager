<template>
    <div id="app" v-text-color="'text_base'">
        <Main v-if="isAuthenticated"/>
        <Auth v-else/>
         <!--<Landing v-else/>-->
    </div>
</template>

<script>
import Auth from '@/views/Auth';
import Landing from '@/views/Landing';
import Main from '@/layouts/Main';
import { mapGetters } from 'vuex';

export default {
  components: {
    Auth,
    Main,
    Landing
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  }
};
</script>
