<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button @click.prevent="preLogout"></v-ons-back-button>
      </div>
      <div class="center">POS管理ページ</div>
      <div class="right">
        <span class="user-name">{{ user.name }}</span>
      </div>
    </v-ons-toolbar>

    <el-row>
      <el-col :span="8" v-for="menu in menus" :key="menu.id" :offset="0">
        <div @click="pushButton(menu)">
          <menu-button ref="prod" :menu="menu"/>
        </div>
      </el-col>
    </el-row>

    <edit-user-modal :isSelf="true" ref="myDataEdit"/>
  </v-ons-page>
</template>

<script>
import menu from "~/pages/menu/";
import pos from "~/pages/payment/";
import MenuButton from "~/components/admin/MenuButton";
import EditUserModal from "~/components/admin/EditUserModal";

import product_manager from "~/pages/admin/product_manager";
import inventory_manager from "~/pages/admin/inventory_manager";

import users_manager from "~/pages/admin/users_manager";

import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      menuList: [
        {
          title: "商品一覧",
          description: "商品情報などの設定",
          icon: ["fas", "tag"],
          page: product_manager,
          authority: [1]
        },
        {
          title: "在庫管理",
          description: "在庫や、表示/非表示の管理",
          icon: ["fas", "yen-sign"],
          page: inventory_manager,
          authority: [1, 3]
        },
        {
          title: "点検・生産",
          description: "入出金、レジチェックなど",
          icon: ["fas", "money-check-alt"],
          authority: [1]
        },
        {
          title: "売上",
          description: "日別売上、商品別売上など",
          icon: ["fas", "chart-line"],
          authority: [1]
        },
        {
          title: "ユーザ管理",
          description: "販売員情報の閲覧・変更など",
          icon: ["fas", "users"],
          page: users_manager,
          authority: [1]
        },
        {
          title: "個人設定",
          description: "パスワードの変更など",
          icon: ["fas", "cogs"],
          click: () => {
            this.editModal();
          },
          authority: [1, 2, 3, 4]
        }
      ]
    };
  },
  components: {
    MenuButton,
    EditUserModal
  },
  methods: {
    editModal() {
      this.$refs.myDataEdit.open(this.user.id);
    },
    pushButton(menu) {
      if (menu.page) {
        this.$emit("push-page", menu.page);
      } else if (menu.click) {
        menu.click();
      }
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
        if (menu.authority.includes(this.user.authority)) {
          menus.push(menu);
        }
      });
      return menus;
    },
    ...mapState("pos/payment-method", ["payment_method"]),
    ...mapState("pos/admin", ["user"])
  }
};
</script>

<style lang="scss">
.toolbar {
  .right {
    > span.user-name {
      margin-right: 10px;
    }
  }
}
</style>
