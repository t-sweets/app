<template>
  <v-ons-page>
    <div class="startbody">
      <div class="top-image">
        <img src="~/assets/images/icon.svg" width="20%" alt>
        <p class="top-text">
          田胡研Sweets
          <br>POSシステム
        </p>
      </div>

      <div class="progress" style="text-align: center">
        <el-progress :percentage="Math.round(progress)"></el-progress>
      </div>
    </div>

    <sweet-modal
      ref="POSAccountInit"
      width="50%"
      title="POS Login"
      :blocking="true"
      :hide-close-button="true"
    >
      <el-form
        ref="account_register_form"
        :model="account_register_form"
        label-width="120px"
        @submit.native.prevent="registerPOSConfig"
        :rules="account_register_rule"
      >
        <el-form-item label="Shop Name" prop="shop_name">
          <el-input v-model="account_register_form.shop_name" placeholder="Sweets n号店"></el-input>
        </el-form-item>
        <el-form-item label="Terminal ID" prop="terminal_id">
          <el-input v-model="account_register_form.terminal_id" placeholder="POS0001"></el-input>
        </el-form-item>
        <el-form-item label="Account" prop="account_email">
          <el-input v-model="account_register_form.account_email" placeholder="pos@example.com"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="account_password">
          <el-input v-model="account_register_form.account_password" type="password"></el-input>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" native-type="submit">Login</el-button>
        </el-form-item>
      </el-form>
    </sweet-modal>
  </v-ons-page>
</template>

<script>
import pos from "~/pages/payment/";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      progress: 0,

      account_register_form: {
        shop_name: "",
        terminal_id: "",
        account_email: "",
        account_password: ""
      },
      account_register_rule: {
        shop_name: [
          {
            required: true,
            message: "店舗名を入力してください",
            trigger: "blur"
          }
        ],
        terminal_id: [
          {
            required: true,
            message: "端末IDを入力してください",
            trigger: "blur"
          }
        ],
        account_email: [
          {
            required: true,
            message: "認証POSアカウントのemailを入力してください",
            trigger: "blur"
          }
        ],
        account_password: [
          {
            required: true,
            message: "POSアカウントのパスワードを入力してください",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    start() {
      this.$emit("push-page", pos);
    },

    /**
     * アカウント登録用モーダルを表示
     */
    openPOSConfig() {
      this.account_register_form = {
        ...this.config
      };
      this.$refs.POSAccountInit.open();
    },

    /**
     *
     */
    async registerPOSConfig() {
      await this.$refs.account_register_form.validate(async valid => {
        if (valid) {
          await this.setConfig(this.account_register_form);
          this.$refs.POSAccountInit.close();
          this.init();
        }
      });
    },

    async init() {
      // POSアカウントが登録されているか確認
      if (!this.config.account_email || !this.config.account_password) {
        this.openPOSConfig();
      } else {
        /**
         * 起動シークエンス
         */
        const initializeMethods = [
          this.initialize,
          this.getAuthorities,
          this.getProducts,
          this.getPaymentMethod
        ];

        for (let i = 0; i < initializeMethods.length; i++) {
          const func = initializeMethods[i];
          if (await func()) {
            this.progress += 100 / initializeMethods.length;
            await new Promise(resolve => setTimeout(resolve, 0)); // sleep
            if (this.progress >= 99) this.start();
            else continue;
          } else {
            let title = "POSを起動できませんでした",
              message;
            // エラーメッセージの設定
            switch (i) {
              case 0:
                message = "POS端末の認証にエラーが発生しました";
                break;
              case 1:
                message = "権限情報を取得できませんでした";
                break;
              case 2:
                message = "商品情報を取得できませんでした";
                break;
              case 3:
                message = "決済情報を取得できませんでした";
                break;
              default:
                message = "不明なエラーが発生しました";
            }
            this.initError({
              title: title,
              message: message
            });
            break;
          }
        }
      }
    },

    initError({ title, message }) {
      this.$ons.notification.confirm({
        title: title,
        message: message,
        buttonLabels: ["再起動", "設定"],
        callback: index => {
          if (index == 0) {
            this.$ons.notification
              .confirm({
                message: "再起動しますか？",
                buttonLabels: ["再起動"],
                primaryButtonIndex: 0
              })
              .then(index => {
                if (index == 0) location.reload();
              });
          } else if (index == 1) {
            this.openPOSConfig();
          }
        }
      });
    },
    ...mapActions("pos", ["initialize", "getAuthorities", "getProducts"]),
    ...mapActions("pos/payment-method", ["getPaymentMethod"]),
    ...mapMutations("pos", ["setConfig"])
  },
  computed: {
    ...mapState("pos", ["config"])
  },
  async mounted() {
    setTimeout(() => {
      // localstorageから値が戻ってくるのを一瞬待つ。
      this.init();
    }, 0);
  }
};
</script>

<style lang="scss" scoped>
.startbody {
  width: 100vw;
  height: 100vh;
  background-color: white;
  .top-image {
    padding-top: 20vh;
    padding-bottom: 50px;
    .top-text {
      margin-top: 20px;
      font-size: 25px;
      font-weight: 500;
      color: #4b9ad8;
    }
  }
}
</style>

<style lang="scss">
.startbody {
  .el-button.is-round {
    border-radius: 100px;
    padding: 15px 40px;
    color: white;
    span {
      font-size: 40px;
    }
  }

  .progress {
    width: 40vw;
    margin: 0 auto;
  }
}
</style>

