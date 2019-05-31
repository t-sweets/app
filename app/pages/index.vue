<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="center">管理者画面</div>
      <div class="right">
        <el-button @click="logout" type="danger" size="small" plain>Logout</el-button>
      </div>
    </v-ons-toolbar>

    <el-row>
      <el-col :span="10" v-for="menu in menus" :key="menu.id" :offset="0">
        <nuxt-link :to="menu.link">
          <menu-button ref="prod" :menu="menu"/>
        </nuxt-link>
      </el-col>
    </el-row>
  </v-ons-page>
</template>

<script>
import MenuButton from "~/components/startup/MenuButton.vue";

export default {
  data() {
    return {
      menus: [
        {
          title: "販売画面",
          img: "",
          link: "/"
        }
      ]
    };
  },
  methods: {
    logout({ redirect }) {
      Cookie.remove("auth");
      this.$store.commit("update", null);
      document.location = "/";
      // this.$router.push("/");
    }
  },
  components: { MenuButton }
};
</script>

<style lang="scss" scoped>
el-button {
  margin: 5px;
}
</style>

