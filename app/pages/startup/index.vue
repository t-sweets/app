<template>
  <v-ons-page>
    <div class="startbody">
      <div class="top-image">
        <img src="~/assets/images/icon.svg" width="20%" alt>
        <p class="top-text">田胡研Sweets
          <br>POSシステム
        </p>
      </div>

      <div class="progress" style="text-align: center">
        <el-progress :percentage="Math.round(progress)"></el-progress>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
import pos from "~/pages/payment/";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      progress: 0
    };
  },
  methods: {
    start() {
      this.$emit("push-page", pos);
    },
    initError({ title, message }) {
      this.$ons.notification.alert({
        title: title,
        message: message,
        callback: () => {
          this.$ons.notification
            .confirm({
              message: "再起動しますか？",
              buttonLabels: ["再起動"],
              primaryButtonIndex: 0
            })
            .then(index => {
              if (index == 0) location.reload();
            });
        }
      });
    },
    ...mapActions("pos", ["initialize", "getAuthorities", "getProducts"]),
    ...mapActions("pos/payment-method", ["getPaymentMethod"])
  },
  computed: {},
  async mounted() {
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

