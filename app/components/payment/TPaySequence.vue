<template>
  <div class="tutorial">
    <div class="requireReceipt">
      <el-checkbox v-model="isReceiptIssue">レシートを発行する</el-checkbox>
    </div>
    <div class="animation" v-show="tpay_method == 'felica'">
      <div class="handbox">
        <img class="hand" :class="{pause: isPause}" src="~/assets/images/felica_hand.svg" alt>
      </div>
      <img class="reader" src="~/assets/images/felica.png" alt>
    </div>
    <qriously :value="testURL" :size="200" v-show="tpay_method == 'qr'"/>
    <div class="warning">
      <p>{{ announceText }}</p>
      <el-button @click="reSelect" type="text">別の支払方法を選択する</el-button>
    </div>

    <sweet-modal
      ref="modal"
      width="80%"
      overlay-theme="dark"
      :blocking="true"
      :hide-close-button="true"
      icon="success"
    >
      <div class="main">
        <p>決済がタイムアウトしました</p>
        <el-button type="primary" @click="preparePayment();" round>もう一度</el-button>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      isPause: false,
      tpay_method: "felica",
      testURL: "http://www.google.com",
      isReceiptIssue: true
    };
  },
  props: ["items"],
  methods: {
    changeMethod() {
      if (this.tpay_method == "felica") {
        this.tpay_method = "qr";
        this.setStatus("pending");
      } else {
        this.tpay_method = "felica";
        this.preparePayment();
      }
    },
    reSelect() {
      this.setStatus("pending");
      this.$emit("reSelect");
    },
    /*
     ** Start Card Reader
     */
    async preparePayment() {
      await this.showMessage(["Touch Felica", "Card"]);

      // リーダへのリクエスト開始
      const response = await this.execCardReader();

      if (response === true) {
        this.connectApi();
      } else if (response === false) {
        this.playSE("error");
        this.$ons.notification.alert("不明なエラーが発生しました。");
      } else if (response === 408) {
        this.playSE("error");
        this.isPause = true;
        await this.showMessage(["Timeout Reader", ""]);
        this.$ons.notification.confirm({
          title: "エラー",
          message: "リーダーがタイムアウトしました",
          cancelable: true,
          buttonLabel: ["キャンセル", "再試行"],
          callback: async index => {
            if (index == 1) {
              this.isPause = false;
              this.preparePayment();
            }
          }
        });
      }
    },

    /**
     * API Tokenなどの発行
     */
    async connectApi() {
      this.isPause = true;
      this.loading = this.$loading({
        text: "Loading",
        lock: false
      });
      if (await this.getApiToken()) {
        const response = await this.checkoutWithFelica({
          amount: this.totalPrice,
          idm: this.idm
        });
        if (response == true) {
          this.recognization();
        } else {
          this.playSE("error");
          this.emissionLED("error");
          let message = "T-Payサーバーとの通信の際に不明なエラーが発生しました";
          switch (response) {
            case "Insufficient funds":
              await this.showMessage([
                "Balance is under",
                "the payment price."
              ]);
              message = "残高不足です。チャージしてください";
              break;
            case "User auth failed":
              await this.showMessage(["This card is not", "registerd."]);
              message = "このカードは登録されていません";
              break;
            case "Merchant not in auth user":
              message =
                "お使いのアカウントはこの店舗で決済を行うことができません";
              break;
          }
          this.isReading = false;
          this.loading.close();
          this.$ons.notification.alert(message);
        }
      }
    },

    async recognization() {
      if (
        await this.purchaseCreate({
          id: this.method.id,
          uuid: this.uuid // 決済番号
        })
      ) {
        this.loading.close();
        this.prepareSuccess();
      } else {
        this.playSE("error");
        this.loading.close();
        this.$ons.notification.alert("決済エラーが発生しました");
      }
    },

    async prepareSuccess() {
      //レシート発行をして、pushSuccess
      if (this.isReceiptIssue) {
        const params = {
          total_price: parseInt(this.totalPrice),
          payment_data: {
            payment_method: "tpay",
            customer_id: `**** **** **** ${this.idm.slice(-4)}`,
            balance: this.before_payment.balance // あとで対応
          },
          products: this.items
        };
        this.printReceipt(params);
      }

      this.$emit("pushSuccess");
    },

    ...mapActions("pos/purchase", ["purchaseCreate"]),
    ...mapActions("pos/receipt-printer", ["printReceipt"]),
    ...mapActions("t-pay", [
      "getApiToken",
      "getMerchantID",
      "checkoutWithFelica"
    ]),
    ...mapActions("t-pay/card-reader", [
      "execCardReader",
      "showMessage",
      "emissionLED"
    ]),
    ...mapMutations("t-pay/card-reader", ["setStatus"])
  },
  computed: {
    changeMethodText() {
      if (this.tpay_method == "felica") return "QRコード認証を使う";
      else return "Felica認証を使う";
    },
    announceText() {
      if (this.tpay_method == "felica")
        return "リーダーに、Felicaをかざしてください";
      else return "スマートフォンでQRを読み取って下さい";
    },

    method() {
      return this.payment_method.filter((_method, index) => {
        if (_method.uuid == "2ADEA824-0027-41B5-B243-10F2D24FDD4B")
          return _method;
      })[0];
    },

    totalPrice() {
      let total = 0;
      this.cart.forEach(product => {
        total += product.price * product.quantity;
      });
      return total;
    },
    ...mapState("pos/payment-method", ["payment_method"]),
    ...mapState("pos/purchase", ["cart"]),
    ...mapState("t-pay", ["uuid", "before_payment"]),
    ...mapState("t-pay/card-reader", ["displayText", "idm", "isReading"])
  },
  mounted() {
    this.preparePayment();
  }
};
</script>


<style lang="scss" scoped>
.tutorial {
  @include pc {
    width: 100%;
  }
  @include tab {
    height: 80%;
  }
  display: inline-block;
  text-align: center;
  .requireReceipt {
    text-align: right;
    margin-right: 50px;
  }
}

.animation {
  text-align: center;
  .handbox {
    .hand {
      max-width: 50vh;
      margin-left: 25vh;
      animation-name: felicaHandAnimation;
      animation-duration: 1.5s;
      animation-direction: alternate;
      animation-iteration-count: infinite;
      &.pause {
        animation-play-state: paused;
      }
    }
  }
  .reader {
    max-width: 45vh;
    margin-right: 25vh;
    margin-top: -200px;
  }
}
.warning {
  text-align: center;
  margin: 2vh 50px;
  font-size: 30px;
}

@keyframes felicaHandAnimation {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(0deg);
  }
  90% {
    transform: rotate(-40deg);
  }
  100% {
    transform: rotate(-40deg);
  }
}
</style>

<style lang="scss">
.el-loading-mask.is-fullscreen {
  z-index: 30000 !important;
}
</style>