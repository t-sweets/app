<template>
  <div class="calc">
    <div class="title">
      <div class="title">入金額</div>
      <div class="total">{{ total }}</div>
    </div>
    <div class="change">
      <div class="title">おつり</div>
      <div class="change">¥{{ change }}</div>
    </div>
    <div class="calc-buttons">
      <div class="calc-button" v-for="num in calcButtons" :key="num">
        <el-button @click="calcButton(num)" :plain="num == 'AC' ? true : false">{{ num }}</el-button>
      </div>
      <div class="calc-button">
        <el-button type="primary" @click="calcButton('OK')" :disabled="!paymentable">完了</el-button>
      </div>
    </div>
    <el-button @click="reSelect" type="text">別の支払方法を選択する</el-button>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      total: "0",
      calcButtons: [1, 2, 3, 4, 5, 6, 7, 8, 9, "AC", 0]
    };
  },
  props: ["items"],
  methods: {
    reSelect() {
      this.$emit("reSelect");
    },
    calcButton(obj) {
      if (typeof obj === "number") {
        this.total != "0" ? (this.total += obj) : (this.total = obj.toString());
      } else if (obj == "AC") {
        this.total = "0";
      } else if (obj == "OK") {
        this.recognization();
      }
    },
    /*
     ** 決済テスト用
     */
    async recognization() {
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
  created() {
    this.total = this.totalPrice;
  }
};
</script>


<style lang="scss" scoped>
.calc {
  @include pc {
    width: 100%;
  }
  @include tab {
    height: 80%;
  }
  display: inline-block;
  text-align: center;
  margin-bottom: 20px;
  .title,
  .change {
    margin: auto 0;
    padding: 5px 30px;
    .title {
      display: inline-block;
    }
    .total {
      display: inline-block;
      width: 400px;
      padding: 0px 10px;
      background-color: rgb(206, 255, 239);
      border: 1px solid rgb(38, 167, 253);
      font-size: 35px;
      text-align: right;
    }
    .change {
      display: inline-block;
      text-align: right;
      width: 400px;
    }
  }
  .calc-buttons {
    margin: 10px 20px;
    .calc-button {
      display: inline-block;
      width: 30%;
      margin: 5px;
      button {
        width: 100%;
      }
    }
  }
}
</style>

