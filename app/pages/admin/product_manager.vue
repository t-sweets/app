<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center">商品管理</div>
      <div class="right">
        <span class="user-name">{{ user.name }}</span>
      </div>
    </v-ons-toolbar>

    <v-ons-search-input placeholder="商品を検索" v-model="search_str"></v-ons-search-input>

    <el-table
      class="manage-list"
      :data="products"
      :default-sort="{prop: 'id', order: 'ascending'}"
      style="width: 100%"
    >
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="price" label="販売価格" sortable width="150"></el-table-column>
      <el-table-column prop="stock" label="現在在庫/変更後在庫" sortable width="250">
        <template slot-scope="scope">
          <span class="table-label">{{scope.row.stock}}</span>
          <el-input-number size="small" v-model="changes.stocks[scope.row.id]"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="display" label="表示" sortable width="130">
        <template slot-scope="scope">
          <v-ons-switch v-model="changes.display[scope.row.id]"></v-ons-switch>
        </template>
      </el-table-column>
      <el-table-column prop="notification" label="在庫通知/通知個数" width="230">
        <template slot-scope="scope">
          <v-ons-switch
            v-model="changes.notifications[scope.row.id]"
            active-color="#13ce66"
            style="vertical-align:middle;"
          ></v-ons-switch>
          <el-input-number size="small" v-model="changes.notification_stocks[scope.row.id]"></el-input-number>
        </template>
      </el-table-column>
    </el-table>

    <div class="tabber">
      <div class="contents tabber-contents">
        <el-row class="middle-center">
          <el-col :span="4">
            <el-button class="tab-button" @click="resetList">Reset</el-button>
          </el-col>
          <el-col :span="16">
            <div style="width:100%;height:10px;"></div>
          </el-col>
          <el-col :span="4">
            <el-button class="tab-button" type="primary" @click="updateProducts">保存する</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="height:80px;"></div>
  </v-ons-page>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      search_str: "",
      display: true,
      changes: {
        stocks: {},
        notifications: {},
        notification_stocks: {},
        display: {}
      }
    };
  },
  computed: {
    /**
     * 検索にヒットした商品情報を返す
     */
    products() {
      if (this.search_str == "") return this.oldProducts;
      else {
        let items = [];
        this.oldProducts.forEach(product => {
          if (product.name.indexOf(this.search_str) > -1) items.push(product);
        });
        return items;
      }
    },
    ...mapState("pos/admin", ["user"]),
    ...mapState("pos/admin/products-manager", {
      oldProducts: state => state.products
    })
  },
  methods: {
    /**
     * 在庫数UPDATE
     */
    async updateProducts() {
      let isSuccess = false;
      for (let k in this.changes.stocks) {
        if (
          this.products.some(item => {
            return (
              item.id == k &&
              (item.stock != this.changes.stocks[k] ||
                item.notification != this.changes.notifications[k])
            );
          })
        ) {
          if (
            await this.setStocks({
              id: k,
              data: {
                stock: this.changes.stocks[k],
                notification: this.changes.notifications[k],
                notification_stock: this.changes.notification_stocks[k],
                display: this.changes.display[k]
              }
            })
          ) {
            this.$notify({
              title: "Success",
              message: "商品在庫を更新しました",
              type: "success",
              duration: 3000
            });
          }
        }
      }
    },
    resetList() {
      this.oldProducts.forEach(item => {
        this.changes.stocks[item.id] = item.stock;
        this.changes.notifications[item.id] = item.notification;
        this.changes.notification_stocks[item.id] = item.notification_stock;
        this.changes.display[item.id] = item.display;
      });
    },
    ...mapActions("pos/admin/products-manager", ["getProducts", "setStocks"]),
    ...mapMutations("pos/admin/products-manager", ["setDisplay"])
  },
  async mounted() {
    if (await this.getProducts()) {
      await this.resetList();
    } else {
      this.$ons.notification.alert({
        title: "通信エラー",
        message: "商品リストを取得できませんでした"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.contents {
  width: 95%;
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
  display: flex;
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
}

.manage-list {
  .table-label {
    margin: auto 20px;
  }
}
</style>

<style lang="scss">
.manage-list {
  ons-switch.switch {
    min-width: 40px;
    width: 40px;
    height: 20px;
    :checked + .switch__toggle {
      background-color: #44db5e;
    }
    .switch__toggle {
      box-shadow: none;
      background-color: #dcdfe6;
      .switch__handle {
        width: 16px;
        height: 16px;
        box-shadow: none;
      }
    }
  }
}
</style>

