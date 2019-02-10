<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="center">メニュー</div>
      <div class="right">
        <v-ons-toolbar-button @click="openLoginPrompt">
          <i class="el-icon-setting"></i>
        </v-ons-toolbar-button>
      </div>
    </v-ons-toolbar>

    <el-row>
      <el-col :span="12" v-for="menu in menus" :key="menu.id" :offset="0">
        <div @click="menu.openPage">
          <menu-button ref="prod" :menu="menu"/>
        </div>
      </el-col>
    </el-row>

    <sweet-modal ref="modal" width="50%" overlay-theme="dark">
      <el-container>
        <el-header>管理者ログイン</el-header>
        <el-main>
          <v-ons-input
            v-model="login.email"
            modifier="underbar"
            type="email"
            placeholder="admin@example.com"
          ></v-ons-input>
          <br>
          <v-ons-input
            v-model="login.password"
            modifier="underbar"
            placeholder="password"
            type="password"
          ></v-ons-input>
          <br>
        </el-main>
        <el-footer>
          <el-button type="primary" @click="pushLogin">ログイン</el-button>
        </el-footer>
      </el-container>
    </sweet-modal>
  </v-ons-page>
</template>

<script>
import pos from "~/pages/payment/";
import charge from "~/pages/charge/index";
import adminPage from "~/pages/admin/";
import MenuButton from "~/components/menu/MenuButton";
import { mapActions } from "vuex";

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
      ],

      login: {
        email: null,
        password: null
      }
    };
  },
  components: {
    MenuButton
  },
  methods: {
    openLoginPrompt() {
      this.$refs.modal.open();
    },
    async pushLogin() {
      if (this.login.email && this.login.password) {
        if (
          await this.loginAdmin({
            email: this.login.email,
            password: this.login.password
          })
        ) {
          this.$refs.modal.close();
          this.$emit("push-page", adminPage);
        }
      } else {
        this.$ons.notification.alert({
          title: "エラー",
          message:
            (this.login.email ? "パスワード" : "メールアドレス") +
            "が入力されていません"
        });
      }
    },
    ...mapActions("pos/admin", ["loginAdmin"])
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  .right {
    > * {
      color: #349aff;
    }
  }
}
ons-input {
  width: 100%;
}
</style>

