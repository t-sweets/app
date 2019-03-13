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
      <el-col :span="sizeOffset(menu.size)" v-for="menu in menus" :key="menu.id" :offset="0">
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
            v-model="login.userkey"
            modifier="underbar"
            type="email"
            placeholder="admin@example.com"
            @keyup.enter="pushLogin"
          ></v-ons-input>
          <br>
          <v-ons-input
            v-model="login.password"
            modifier="underbar"
            placeholder="password"
            type="password"
            @keyup.enter="pushLogin"
          ></v-ons-input>
          <br>
        </el-main>
        <el-footer>
          <el-button type="primary" @click="pushLogin">ログイン</el-button>
        </el-footer>
      </el-container>
    </sweet-modal>
    <sweet-modal
      overlay-theme="dark"
      icon="error"
      ref="errorModal"
      title="Login Error..."
    >ログインに失敗しました
      <sweet-button slot="button">
        <el-button type="primary" @click="$refs.errorModal.close(),$refs.modal.open()">再試行</el-button>
        <el-button @click="$refs.errorModal.close()">Done</el-button>
      </sweet-button>
    </sweet-modal>
  </v-ons-page>
</template>

<script>
import pos from "~/pages/payment/";
import register from "~/pages/register/";
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
          openPage: async () => {
            await this.getProducts();
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
        },
        {
          title: "カード登録",
          size: "small",
          icon: ["fas", "credit-card"],
          description: "T-Payのカードを登録する",
          openPage: () => {
            this.$emit("push-page", register);
          }
        }
      ],

      login: {
        userkey: null,
        password: null
      }
    };
  },
  components: {
    MenuButton
  },
  methods: {
    openLoginPrompt() {
      this.login = {
        userkey: null,
        password: null
      };
      this.$refs.modal.open();
    },
    async pushLogin() {
      document.activeElement.blur();
      if (this.login.userkey && this.login.password) {
        this.$refs.modal.close();
        if (
          await this.loginAdmin({
            userkey: this.login.userkey,
            password: this.login.password
          })
        ) {
          this.$emit("push-page", adminPage);
        } else {
          this.$refs.errorModal.open();
        }
      } else {
        this.$ons.notification.alert({
          title: "エラー",
          message:
            (this.login.userkey
              ? "パスワード"
              : "ユーザ名もしくはメールアドレス") + "が入力されていません"
        });
      }
    },
    sizeOffset(size) {
      switch (size) {
        case "big":
          return 12;
        case "small":
          return 6;
        default:
          return 8;
      }
    },
    ...mapActions("pos", ["getProducts"]),
    ...mapActions("pos/admin", ["loginAdmin"])
  },
  computed: {}
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

