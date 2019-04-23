<template>
  <div class="base">
    <div class="calc">
      <v-ons-list modifier="inset">
        <v-ons-list-item tappable>
          <div class="left">入金額</div>
          <div class="center">
            <el-input size="large" v-model="total" @focus="showPopover($event)">
              <template slot="prepend">¥</template>
            </el-input>
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="center">釣り銭</div>
          <div class="right">{{ `¥${change}` }}</div>
        </v-ons-list-item>
      </v-ons-list>
      <el-button @click="reSelect" type="text">別の支払方法を選択する</el-button>
      <div class="payment-btns">
        <el-button
          type="primary"
          round
          :disabled="!paymentable"
          icon="el-icon-message"
          @click="settlement"
        >支払う</el-button>
      </div>
    </div>
    <calc-popover :popover="popover" prefix="¥" :total="total" @confirm="inputPrice"/>
  </div>
</template>

<script>
import CalcPopover from "@/components/CalcPopover";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      total: 0,
      popover: {
        visible: false,
        target: null,
        direction: "down",
        coverTarget: false
      }
    };
  },
  methods: {
    reSelect() {
      this.$emit("reSelect");
    },
    showPopover(event, direction, coverTarget = false) {
      this.popover.target = event;
      this.popover.coverTarget = coverTarget;
      this.popover.visible = true;
    },
    inputPrice(num) {
      this.total = num;
      this.popover.visible = false;
    },

    /**
     * 決済処理を実行
     */
    async settlement() {
      this.isPause = true;
      this.loading = this.$loading({
        text: "Loading",
        lock: false
      });

      if (
        await this.purchaseCreate({
          id: this.method.id,
          uuid: "aaaaaaa" // 決済番号
        })
      ) {
        this.loading.close();
        this.prepareSuccess();
      } else {
        this.loading.close();
        this.$ons.notification.alert("決済エラーが発生しました");
      }
    },

    /**
     * 決済完了画面へ遷移する前処理
     */
    async prepareSuccess() {
      // レシート情報を格納
      const params = {
        total_price: parseInt(this.totalPrice),
        payment_data: {
          payment_method: "cash",
          cash: parseInt(this.total),
          change: parseInt(this.change)
        },
        products: this.items
      };
      this.set_receipt_data(params);
      this.$emit("pushSuccess");
    },

    ...mapActions("pos/purchase", ["purchaseCreate"]),
    ...mapMutations("pos/receipt-printer", ["set_receipt_data"])
  },
  computed: {
    method() {
      return this.payment_method.filter((_method, index) => {
        if (_method.uuid == "F5EF99BC-0FF0-4CA4-805D-5045E12B90CF")
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
    paymentable() {
      return this.total - this.totalPrice >= 0 ? true : false;
    },
    change() {
      return this.total - this.totalPrice;
    },
    ...mapState("pos/payment-method", ["payment_method"]),
    ...mapState("pos/purchase", ["cart"])
  },
  props: ["items"],
  components: { CalcPopover },
  created() {
    this.total = this.totalPrice;
  }
};
</script>


<style lang="scss" scoped>
.base {
  margin: 0 auto;
  text-align: center;
  .calc {
    @include pc {
      width: 100%;
    }
    @include tab {
      height: 100%;
    }
    padding: 20px 30px;
    margin-bottom: 20px;
    .list {
      width: 100%;
    }
    .el-input {
      font-size: 25px;
    }
    button {
      &.el-button--text {
        font-size: 16px;
      }
    }
    .payment-btns {
      width: 80%;
      margin: 10px auto;
      button {
        width: 100%;
        font-size: 20px;
        padding: 20px;
        border-radius: 100px;
      }
    }
  }
}
</style>

<style lang="scss">
.base {
  .calc {
    .el-input {
      text-align: right;
      margin: 10px auto;
      .el-input__inner {
        height: 55px;
      }
    }
  }
}
</style>

