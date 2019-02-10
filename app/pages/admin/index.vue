<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button @click.prevent="preLogout"></v-ons-back-button>
      </div>
      <div class="center">POS管理ページ</div>
      <div class="right">
        <span>{{ user.name }}</span>
      </div>
    </v-ons-toolbar>

    <el-row>
      <el-col :span="8" v-for="menu in menus" :key="menu.id" :offset="0">
        <div @click="$emit('push-page', menu.page)">
          <menu-button ref="prod" :menu="menu"/>
        </div>
      </el-col>
    </el-row>
  </v-ons-page>
</template>

<script>
import menu from "~/pages/menu/";
import pos from "~/pages/payment/";
import MenuButton from "~/components/admin/MenuButton";

import product_manager from "~/pages/admin/product_manager";
import inventory_manager from "~/pages/admin/inventory_manager";

import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      isShowTotal: false,
      selectedMethod: null,

      menuList: [
        {
          title: "商品一覧",
          description: "商品情報などの設定",
          icon: ["fas", "tag"],
          page: product_manager,
          authory: [1]
        },
        {
          title: "在庫管理",
          description: "在庫や、表示/非表示の管理",
          icon: ["fas", "yen-sign"],
          page: inventory_manager,
          authory: [1, 3]
        },
        {
          title: "点検・生産",
          description: "入出金、レジチェックなど",
          icon: ["fas", "money-check-alt"],
          authory: [1]
        },
        {
          title: "売上",
          description: "日別売上、商品別売上など",
          icon: ["fas", "chart-line"],
          authory: [1]
        }
      ]
    };
  },
  components: {
    MenuButton
  },
  methods: {
    /*
     ** 関数から決済パネルの表示非表示を定める
     */
    showTotal(bool) {
      this.isShowTotal = bool;
    },
    selectMethod(method) {
      this.selectedMethod = method;
      this.showTotal(true);
    },
    preLogout() {
      this.$ons.notification
        .confirm({
          title: "確認",
          message: "ログアウトしますか？",
          buttonLabels: ["キャンセル", "ログアウト"]
        })
        .then(index => {
          if (index == 1) {
            this.logout();
            this.$emit("pop-page", menu);
          }
        });
    },
    ...mapActions("pos/payment-method", ["getPaymentMethod"]),
    ...mapActions("pos/admin", ["logout"])
  },
  computed: {
    menus() {
      let menus = [];
      this.menuList.forEach(menu => {
        if (menu.authory.includes(this.user.authority)) {
          menus.push(menu);
        }
      });
      return menus;
    },
    ...mapState("pos/payment-method", ["payment_method"]),
    ...mapState("pos/admin", ["user"])
  },
  async created() {}
};
</script>

<style lang="scss" scoped>
.toolbar {
  .right {
    > * {
      margin-right: 10px;
    }
  }
}
</style>
