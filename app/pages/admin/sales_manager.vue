<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center">
        <v-ons-segment tabbar-id="tabbar" :index.sync="segmentIndex" style="width: 300px">
          <button>日別売上</button>
          <button>商品別売上</button>
        </v-ons-segment>
      </div>
      <div class="right">
        <span class="user-name">{{ user.name }}</span>
      </div>
    </v-ons-toolbar>
    <v-ons-tabbar id="tabbar" :tabs="tabs" :index.sync="tabbarIndex" animation="none"></v-ons-tabbar>
  </v-ons-page>
</template>

<script>
import dailySales from "~/pages/admin/sales/dailySales";
import productSales from "~/pages/admin/sales/productSales";
import { mapState } from "vuex";
export default {
  data() {
    return {
      segmentIndex: 0,
      tabbarIndex: 0,
      tabs: [
        {
          page: dailySales,
          key: "dailySales"
        },
        {
          page: productSales,
          key: "dailySales2"
        }
      ]
    };
  },
  computed: {
    ...mapState("pos/admin", ["user"])
  }
};
</script>

<style lang="scss">
.segment__button {
  border: 1px solid #409eff;
}
:checked + .segment__button {
  background-color: #409eff;
}
</style>
