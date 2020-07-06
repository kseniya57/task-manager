<template>
  <div class="landing fullwidth fullheight df aic jcc fdc">
    <v-image class="landing__keyboard" src="landing/keyboard.png" local="true"/>
    <h1 class="landing__title">{{ text.app.name }}</h1>
    <v-button v-color="'secondary'" class="landing__button" v-to="">Go to dashboard</v-button>
    <v-image class="landing__coffee" src="landing/coffee.png" local="true"/>
  </div>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
  .landing
    background-color: #ff8787
    &__keyboard
      position: absolute
      left: 10vw
      width: 60vw
      top: -15rem
      transform: rotate(-10deg)

    &__coffee
      position: absolute
      bottom: -15rem
      right: 0
      width: 40vw

    &__button
      position: absolute
      bottom: 5rem
      left: 45vw
      font-size: 2rem
      height: 5rem


    &__title
      font-size: 7rem
      background: -webkit-linear-gradient($white, $secondary)
      -webkit-background-clip: text
      -webkit-text-fill-color: transparent
</style>
