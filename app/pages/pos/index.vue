<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button @click.prevent="backMenu"></v-ons-back-button>
      </div>
      <div class="center">商品一覧</div>
    </v-ons-toolbar>
    <v-ons-search-input placeholder="Search something" v-model="search_str"></v-ons-search-input>
    <el-row>
      <el-col :span="5" v-for="product in search" :key="product.id" :offset="0">
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
            <el-button class="tab-button" type="primary" @click="showTotal(true)" round>Purchase</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="tab-button" type="info" @click="resetCart()" round>Reset</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-show="isShowSubtotal" style="height:80px;"></div>
  </v-ons-page>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Products from "~/components/pos/Products.vue";
import TotalAccount from "~/components/pos/TotalAccount.vue";
import MenuPage from "~/pages/pos/menu";
import DonePage from "~/pages/pos/done";

const uuidv4 = require("uuid/v4");

export default {
  data() {
    return {
      search_str: "",
      isShowTotal: false
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
    addCart(product) {
      let isExist = false;
      this.cart.some((item, index) => {
        if (item.id == product.id) {
          isExist = !isExist;
          this.setQuantity({ index: index, quantity: product.quantity });
          return true;
        }
      });
      if (!isExist) this.setProduct(product);
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
      if (this.cart.length < 1) this.showTotal(false);
    },
    /*
     ** カートの内容をリセット
     */
    resetCart(id) {
      this.resetProduct();
      this.$refs.prod.forEach((_, index) => {
        this.$refs.prod[index].resetCart();
      });
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
            return -1;
          }
        }
        this.isShowTotal = bool;
      }
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
      this.$emit("pop-page", MenuPage);
    },

    ...mapMutations("pos/purchase", [
      "setUUID",
      "setProduct",
      "removeProduct",
      "setQuantity",
      "resetProduct"
    ]),
    ...mapActions("pos", ["getProducts"]),
    ...mapActions("pos/purchase", ["purchaseCheck"])
  },
  computed: {
    /*
     ** 商品のリアルタイム検索
     */
    search() {
      var products = [];
      if (!this.search_str) return this.products.concat();
      this.products.forEach(product => {
        if (product.name.indexOf(this.search_str) != -1) products.push(product);
      });
      return products;
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
  mounted() {
    const transactionUUID = uuidv4();
    this.setUUID(transactionUUID);
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
  background: url(~assets/images/background.png);
}
</style>
