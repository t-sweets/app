<template>
  <v-ons-page class="withdrawal">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center">
        <v-ons-segment tabbar-id="tabbar" :index.sync="segmentIndex" style="width: 300px">
          <button>入金</button>
          <button>出金</button>
        </v-ons-segment>
      </div>
    </v-ons-toolbar>
    <v-ons-tabbar id="tabbar" :tabs="tabs" :index.sync="tabbarIndex" animation="none"></v-ons-tabbar>
  </v-ons-page>
</template>


<script>
import deposit from "@/pages/admin/liquidation/deposit";
import withdraw from "@/pages/admin/liquidation/withdraw";

export default {
  data() {
    return {
      segmentIndex: 0,
      tabbarIndex: 0,
      tabs: [
        {
          page: deposit,
          key: "dailySales",
          props: {
            pop_page: () => {
              this.$emit("dialog-pop-page");
            }
          }
        },
        {
          page: withdraw,
          key: "dailySales2",
          props: {
            pop_page: () => {
              this.$emit("dialog-pop-page");
            }
          }
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.withdrawal {
  .segment__button {
    border: 1px solid #409eff !important;
  }
  :checked + .segment__button {
    background-color: #409eff !important;
  }
}
</style>