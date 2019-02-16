<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center">ユーザ管理</div>
      <div class="right">
        <span class="user-name">{{ user.name }}</span>
      </div>
    </v-ons-toolbar>

    <div style="height:80px;"></div>
  </v-ons-page>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("pos/admin", ["user"])
  }
};
</script>

<style>
</style>
