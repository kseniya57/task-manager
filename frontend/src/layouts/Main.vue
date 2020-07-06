<template>
    <div  v-color="'white'">
        <Header/>
        <div class="df">
            <Sidebar/>
            <div class="container">
                <router-transition>
                    <router-view :key="$route.path" />
                </router-transition>
            </div>
        </div>
        <sheet>
            <v-button slot="activator" type="circle" class="theme-button" v-color="'accent'">
                <v-icon name="palette" color="white"/>
            </v-button>
            <theme-generator slot="content" class="theme-sheet"/>
        </sheet>
        <notifications-manager />
        <modal-manager/>
        <context-menu-manager/>
        <file-uploader/>
    </div>
</template>

<script>
import Header from '@/layouts/Header';
import Sidebar from '@/layouts/Sidebar';
import { RouterTransition } from '@/components/Transition';
import Sheet from '@/components/Common/Sheet';
import ThemeGenerator from '@/components/ThemeGenerator';
import {
  ModalManager,
  ContextMenuManager,
  NotificationsManager,
  FileUploader
} from '@/components/Services';

export default {
  components: {
    ModalManager,
    ContextMenuManager,
    NotificationsManager,
    FileUploader,
    Header,
    Sidebar,
    RouterTransition,
    Sheet,
    ThemeGenerator
  }
};
</script>

<style lang="sass" scoped>
    .theme
        &-button
            position: absolute
            bottom: 1rem
            left: 1rem
</style>
