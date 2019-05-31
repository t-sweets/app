<template>
  <v-ons-dialog
    id="totalAccount"
    class="total-dialog"
    :visible="isShowTotal"
    @posthide="change(false)"
  >
    <el-row class="nav">
      <el-col :span="4">
        <v-ons-button
          class="cancel-button"
          @click="change(false)"
          modifier="quiet"
          style="margin: 6px 0"
        >キャンセル</v-ons-button>
      </el-col>
      <el-col class="nav-title" :span="16">
        <span>お会計</span>
      </el-col>
      <el-col :span="4"></el-col>
    </el-row>
    <div class="products" v-show="!paymethod">
      <el-row class="contents" v-for="item in items" :key="item.id">
        <el-col class="image" :span="7">
          <img :src="toImageUrl(item.image_path)" alt>
        </el-col>
        <el-col :span="16">
          <div class="middle-center">
            <p class="product-name">{{ item.name }}</p>
            <p class="product-quantity">{{ item.quantity }}個</p>
          </div>
        </el-col>
        <el-col :span="1">
          <div class="middle-center">
            <el-button icon="el-icon-delete" circle @click="remove(item.id)"></el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="total">
      <el-row class="quantity">
        <el-col :span="20">お買い上げ点数</el-col>
        <el-col class="right" :span="4">{{ totalQuantity }}点</el-col>
      </el-row>
      <el-row class="price">
        <el-col :span="20">合計金額</el-col>
        <el-col class="right" :span="4">¥{{ totalPrice }}</el-col>
      </el-row>
    </div>
    <transition name="buttons">
      <div class="payment-btns" v-if="!paymethod">
        <el-row>
          <el-col :span="10" v-for="method in payment_method" :key="method.id" :offset="1">
            <el-button
              type="primary"
              round
              @click="selectPaymentMethod(method.uuid)"
              icon="el-icon-message"
              :disabled="method.uuid == '2ADEA824-0027-41B5-B243-10F2D24FDD4B' ? !isServiceable : false"
            >{{ method.name }}</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <transition name="sequence">
      <t-pay
        v-if="paymethod=='2ADEA824-0027-41B5-B243-10F2D24FDD4B'"
        :items="itemsBeutiyForReceipt"
        @pushSuccess="pushSuccess"
        @reSelect="reSelect"
        @transitionCharge="$emit('transitionCharge', $event)"
      ></t-pay>
      <cash
        v-if="paymethod=='F5EF99BC-0FF0-4CA4-805D-5045E12B90CF'"
        :items="itemsBeutiyForReceipt"
        @pushSuccess="pushSuccess"
        @reSelect="reSelect"
      ></cash>
    </transition>
  </v-ons-dialog>
</template>

<script>
import TPay from "~/components/payment/TPaySequence";
import Cash from "~/components/payment/CashSequence";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      paymethod: undefined
    };
  },
  props: ["isShowTotal", "items", "totalPrice", "totalQuantity"],
  methods: {
    change(bool) {
      this.paymethod = undefined;
      if (bool === false) this.setStatus("pending");
      this.$emit("showTotal", bool);
    },
    remove(id) {
      this.$emit("removeCart", id);
    },
    tpay() {
      this.change(false);
      this.$emit("pushTPay");
    },
    reSelect() {
      this.paymethod = undefined;
    },
    async selectPaymentMethod(uuid) {
      if (await this.purchaseCheck()) {
        this.paymethod = uuid;
      }
    },
    async pushSuccess() {
      this.$emit("pushSuccess");
    },
    toImageUrl(path) {
      return path.match(
        /^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/
      )
        ? path
        : process.env.POS_HOST + "/../.." + path;
    },
    ...mapMutations("t-pay/card-reader", ["setStatus"]),
    ...mapActions("pos/purchase", ["purchaseCheck"])
  },
  components: {
    TPay,
    Cash
  },
  computed: {
    itemsBeutiyForReceipt() {
      let items = [];
      this.items.forEach(item => {
        items.push({
          name: item.name,
          pcs: item.quantity,
          unit: item.price,
          price: item.quantity * item.price
        });
      });
      return items;
    },
    ...mapState("pos/payment-method", ["payment_method"]),
    ...mapGetters("t-pay", ["isServiceable"])
  }
};
</script>

<style lang="scss" scoped>
.total-dialog {
  .nav {
    border-bottom: solid 0.5px #999;
    .nav-title {
      font-size: 20px;
      font-weight: 500;
      text-align: center;
      margin-top: 12px;
    }
  }
  .products {
    border-bottom: solid 0.5px #999;
    max-height: 40vh;
    overflow: scroll;
  }
  .contents {
    width: 80%;
    height: 10vh;
    margin: 5px auto;
    &:not(:last-child) {
      border-bottom: solid 0.5px #999;
    }
    .image {
      height: 100%;
      padding-bottom: 5px;
      img {
        height: 100%;
        border-radius: 5px;
      }
    }
    .middle-center {
      height: 10vh;
      display: table-cell;
      vertical-align: middle;
      .product-name {
        font-size: 18px;
        font-weight: 400;
      }
      .product-quantity {
        font-size: 13px;
        color: #999;
      }
    }
  }
  .total {
    margin: 20px auto;
    width: 90%;
    .el-row {
      margin: 8px auto;
      font-size: 20px;
      &.quantity {
        color: #777;
      }
      .right {
        text-align: right;
      }
    }
  }
  .payment-btns {
    width: 100%;
    margin: 20px auto;
    margin-left: 3%;
    button {
      width: 100%;
      font-size: 20px;
      padding: 20px;
      border-radius: 100px;
    }
  }
}
.buttons-enter-active {
  animation-name: fadeInButtons;
  animation-duration: 0.5s;
}
.buttons-leave-active {
  animation-name: fadeOutButtons;
  animation-duration: 1s;
}
.buttons-leave {
  margin-right: 0px;
  opacity: 0;
}
.sequence-enter {
  margin-left: 100%;
  margin-top: -80px;
}
.sequence-enter-active {
  animation-name: fadeInSequence;
  animation-duration: 1s;
  margin-top: -80px;
}
@keyframes fadeInButtons {
  from {
    margin-right: 100%;
    opacity: 0;
  }
  to {
    margin-right: 10%;
    opacity: 1;
  }
}
@keyframes fadeOutButtons {
  from {
    margin-right: 0%;
    opacity: 1;
  }
  to {
    margin-right: 100%;
    opacity: 0;
  }
}
@keyframes fadeInSequence {
  from {
    margin-left: 100%;
    opacity: 0;
  }
  to {
    margin-left: 0%;
    opacity: 1;
  }
}
</style>


<style lang="scss">
.total-dialog {
  .dialog {
    width: 90%;
    // bottom: 0;
    // top: auto;
    // transform: translate(-50%, 0);
    ons-button.cancel-button {
      color: #555;
      cursor: pointer;
    }
  }
  @media screen and (min-width: 1024px) {
    .dialog {
      width: 80%;
    }
  }
}
</style>

