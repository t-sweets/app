<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-button class="cancel-button" @click="$emit('dialog-hide')" modifier="quiet">キャンセル</v-ons-button>
      </div>
      <div class="center">点検・清算</div>
    </v-ons-toolbar>
    <div class="menu-buttons">
      <el-row :gutter="20">
        <el-col :span="12" v-for="menu in menus" :key="menu.id">
          <el-button class="inspect-menu-button" size="large" @click="menu.onClick">{{ menu.title }}</el-button>
        </el-col>
      </el-row>
    </div>
  </v-ons-page>
</template>

<script>
import withdrawal from "@/components/admin/liquidation/withdrawal";
import registerCheck from "@/pages/admin/liquidation/registerCheck";

export default {
  data() {
    return {
      menus: [
        {
          title: "入出金",
          onClick: () => {
            this.$emit("dialog-push-page", withdrawal);
          }
        },
        {
          title: "レジチェック",
          onClick: () => {}
        },
        {
          title: "レジチェック履歴",
          onClick: () => {
            this.$emit("dialog-push-page", registerCheck);
          }
        }
      ]
    };
  }
};
</script>
