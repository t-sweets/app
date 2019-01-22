<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="center">メニュー</div>
    </v-ons-toolbar>

    <el-row>
      <el-col :span="10" v-for="menu in menus" :key="menu.id" :offset="0">
        <div @click="menu.openPage">
          <menu-button ref="prod" :menu="menu"/>
        </div>
      </el-col>
    </el-row>
  </v-ons-page>
</template>

<script>
import pos from "~/pages/pos/index.vue";
import MenuButton from "~/components/menu/MenuButton";

export default {
  data() {
    return {
      /*
       ** 一般メニューに表示するコンテンツ一覧
       */
      menus: [
        {
          title: "商品購入",
          icon: "",
          openPage: () => {
            this.$emit("push-page", pos);
          }
        }
      ]
    };
  },
  components: {
    MenuButton
  }
};
</script>

