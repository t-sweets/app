<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="center">メニュー</div>
    </v-ons-toolbar>

    <el-row>
      <el-col :span="12" v-for="menu in menus" :key="menu.id" :offset="0">
        <div @click="menu.openPage">
          <menu-button ref="prod" :menu="menu"/>
        </div>
      </el-col>
    </el-row>
  </v-ons-page>
</template>

<script>
import pos from "~/pages/payment/index";
import charge from "~/pages/charge/index";
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
          size: "big",
          icon: ["fas", "cash-register"],
          description: "Sweetsのお会計画面はこちら",
          openPage: () => {
            this.$emit("push-page", pos);
          }
        },
        {
          title: "チャージ",
          size: "big",
          icon: ["fas", "credit-card"],
          description: "電子マネーの残高チャージはこちら",
          openPage: () => {
            this.$emit("push-page", charge);
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

