<template>
  <v-ons-page id="product-list">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button @click.prevent="backMenu"></v-ons-back-button>
      </div>
      <div class="center">商品一覧</div>
    </v-ons-toolbar>
    <el-row>
      <el-col
        :xs="11"
        :sm="7"
        :md="5"
        :lg="5"
        :xl="5"
        v-for="product in search"
        :key="product.id"
        :offset="0"
      >
        <products ref="prod" :product="product" @addCart="addCart"/>
      </el-col>
    </el-row>
    <transition name="el-zoom-in-bottom">
      <total-account
        :isShowTotal="isShowTotal"
        :items="items"
        :totalQuantity="totalQuantity"
        :totalPrice="totalPrice"
        @pushSuccess="pushSuccess"
        @showTotal="showTotal"
        @removeCart="removeCart"
        @transitionCharge="transitionCharge"
      />
    </transition>
    <div class="tabber" :class="{visible: isShowSubtotal}">
      <div class="contents tabber-contents">
        <el-row class="middle-center">
          <el-col :span="16">
            <el-row class="quantity">
              <el-col :span="12">お買い上げ点数</el-col>
              <el-col :span="12">{{ totalQuantity }}点</el-col>
            </el-row>
            <el-row class="price">
              <el-col :span="12">小計</el-col>
              <el-col :span="12">¥{{ totalPrice }}</el-col>
            </el-row>
          </el-col>
          <el-col :span="4">
            <el-button class="tab-button" type="primary" @click="showTotal(true)" round>
              <b>お会計</b>
            </el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="tab-button" type="info" @click="resetCart()" round>リセット</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-show="isShowSubtotal" style="height:80px;"></div>
  </v-ons-page>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Products from "~/components/payment/Products.vue";
import TotalAccount from "~/components/payment/TotalAccount.vue";
import MenuPage from "~/pages/menu/";
import DonePage from "~/pages/payment/done";
import ChargePage from "@/pages/charge/";

const uuidv4 = require("uuid/v4");

export default {
  data() {
    return {
      search_str: "",
      isShowTotal: false,
      jancode: ""
    };
  },
  components: {
    Products,
    TotalAccount
  },
  methods: {
    /*
     ** 商品をカートに追加する
     */
    async addCart(product) {
      const quantity = await this.getQuantity(product.id);
      if (quantity > 0) {
        this.cart.some((item, index) => {
          if (item.id == product.id) {
            this.setQuantity({ index: index, quantity: quantity + 1 });
            return true;
          }
        });
      } else
        this.setProduct({
          id: product.id,
          name: product.name,
          quantity: 1,
          price: product.price
        });
    },

    /**
     * リーダスキャンして商品追加
     */
    async addCartWithReader() {
      const product = await this.getProductWithReader(this.jancode);
      this.jancode = "";
      if (!product) {
        this.$ons.notification.alert({
          title: "エラー",
          message: "登録されていない商品です"
        });
        return false;
      }
      this.$refs.prod.some((item, index) => {
        if (item.product.id == product.id) {
          this.$refs.prod[index].quantity += 1;
          return true;
        }
      });
      this.productToHeadAndScroll(product);
      this.addCart(product);
    },

    /*
     ** 商品をカートから削除
     */
    removeCart(id) {
      this.$refs.prod.some((item, index) => {
        if (item.product.id == id) {
          this.$refs.prod[index].quantity = 0;
          return true;
        }
      });
      this.cart.some((item, index) => {
        if (item.id == id) {
          this.removeProduct(index);
          this.showTotal();
          return true;
        }
      });
    },
    /*
     ** カートの内容をリセット
     */
    resetCart(id) {
      this.resetProduct();
      if (!this.$refs.prod) return false;
      this.$refs.prod.forEach((_, index) => {
        this.$refs.prod[index].resetCart();
      });
    },

    /**
     * 先頭に並び替える際に先頭へスクロール
     */
    productToHeadAndScroll(product) {
      this.productToHead(product);
      document.querySelector("#product-list>.page__content").scrollTop = 0;
    },

    /*
     ** 関数から決済パネルの表示非表示を定める
     */
    async showTotal(bool) {
      if (bool == undefined) {
        bool = this.isShowSubtotal;
      } else {
        if (bool) {
          if (await this.purchaseCheck()) {
            // 商品在庫は確立されたのでOK
          } else {
            this.$ons.notification.alert("商品情報が更新されました。", {
              callback: () => {
                this.showTotal(false);
                this.resetCart();
                this.getProducts();
              }
            });
            return false;
          }
        }
      }
      this.enableCodeReader(!bool);
      this.isShowTotal = bool;
    },

    /*
     ** 決済完了ページへ遷移
     */
    pushSuccess() {
      // 決済結果をPOSに送信

      this.showTotal(false);
      this.resetCart();

      this.$emit("push-page", DonePage);
    },
    /*
     ** 一般メニュー画面へ戻る
     */
    backMenu() {
      this.showTotal(false);
      this.resetCart();
      this.enableCodeReader(false);
      this.$emit("pop-page");
    },

    enableCodeReader(bool) {
      if (bool) {
        document.onkeydown = e => {
          const key = e.key;
          if (key !== "Enter") this.jancode += key;
          else {
            if (this.jancode.length == 13 || this.jancode.length == 8)
              this.addCartWithReader();
            else this.jancode = "";
          }
        };
      } else {
        document.onkeydown = () => {};
      }
    },

    /**
     * チャージ画面まで自動遷移
     */
    transitionCharge() {
      this.showTotal(false);
      this.resetCart();
      this.enableCodeReader(false);
      this.$emit("pop-page", ChargePage);
    },

    ...mapMutations("pos", ["productToHead"]),
    ...mapMutations("pos/purchase", [
      "setUUID",
      "setProduct",
      "removeProduct",
      "setQuantity",
      "resetProduct"
    ]),
    ...mapActions("pos", ["getProducts", "getProductWithReader"]),
    ...mapActions("pos/purchase", ["purchaseCheck", "getQuantity"])
  },
  computed: {
    /*
     ** 商品のリアルタイム検索
     */
    search() {
      if (!this.search_str)
        return this.products.filter(product => product.display);
      return this.products.filter(
        product =>
          product.name.indexOf(this.search_str) != -1 && product.display
      );
    },
    /*
     ** 小計タブを表示するかどうか
     */
    isShowSubtotal() {
      return this.cart.length > 0;
    },
    /*
     **
     */
    items() {
      var items = [];
      this.products.forEach(product => {
        this.cart.some(_item => {
          if (_item.id == product.id) {
            items.push({
              quantity: _item.quantity,
              ...product
            });
          }
        });
      });
      return items;
    },
    /*
     ** 合計商品数
     */
    totalQuantity() {
      let quantity = 0;
      this.items.forEach(item => {
        quantity += item.quantity;
      });
      return quantity;
    },
    /*
     ** 合計金額
     */
    totalPrice() {
      let price = 0;
      this.items.forEach(item => {
        price += item.price * item.quantity;
      });
      return price.toLocaleString();
    },

    ...mapState("pos", ["products"]),
    ...mapState("pos/purchase", ["cart"])
  },
  async mounted() {
    const transactionUUID = uuidv4();
    this.setUUID(transactionUUID);
    if (await this.getProducts()) {
      /**
       * バーコードリーダをオン
       */
      this.enableCodeReader(true);
    } else {
      this.$notify({
        title: "エラー",
        message: "商品情報の取得ができませんでした。",
        type: "error"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.contents {
  width: 80%;
  &.tabber-contents {
    margin: 0 auto;
    .el-row {
      margin-top: 8px;
      .quantity {
        color: #777;
      }
      .tab-button {
        margin-top: 12px;
        width: 95%;
      }
    }
  }
}
.el-col-offset-0 {
  margin: 2%;
}
ons-search-input {
  min-width: 95%;
}
.tabber {
  font-family: -apple-system, "Helvetica Neue", "Helvetica", "Arial",
    "Lucida Grande", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  display: none;
  bottom: 0;
  left: 0;
  right: 0;
  white-space: nowrap;
  position: fixed;
  margin: 0;
  padding: 0;
  background-color: #fafafa;
  border-top: 1px solid #ccc;
  width: 100%;
  height: 80px;
  &.visible {
    display: flex;
  }
}
</style>

<style lang="scss">
.page__background {
  // background: url(~assets/images/background.png);
}
</style>
