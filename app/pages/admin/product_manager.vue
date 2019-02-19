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
      <el-table-column prop="name" label="商品名"></el-table-column>
      <el-table-column prop="stock" label="在庫数" sortable width="130"></el-table-column>
      <el-table-column prop="price" label="販売価格" sortable width="130"></el-table-column>
      <el-table-column prop="display" label="表示" sortable width="130">
        <template slot-scope="scope">
          <p>{{ toDisplay(scope.row.display) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="詳細" width="100">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="$refs.productInfoModal.open(scope.row.id)"
          >商品詳細</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="tabber">
      <div class="contents tabber-contents">
        <el-row class="middle-center">
          <el-col :span="4">
            <el-button class="tab-button" @click="$refs.createModal.open()">商品の追加</el-button>
          </el-col>
          <el-col :span="20">
            <div style="width:100%;height:10px;"></div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="height:80px;"></div>

    <product-info ref="productInfoModal"/>
    <arrival-product ref="arrivalModal"/>
    <create-product ref="createModal"/>
  </v-ons-page>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

import ProductInfo from "~/components/admin/ProductInfo";
import CreateProduct from "~/components/admin/CreateProduct";
import ArrivalProduct from "~/components/admin/ArrivalProduct";

export default {
  data() {
    return {
      search_str: ""
    };
  },
  components: {
    ProductInfo,
    CreateProduct,
    ArrivalProduct
  },
  methods: {
    toNotificationStr(bool, num) {
      return bool ? num + "個以下で通知" : "通知しない";
    },
    toDisplay(bool) {
      return bool ? "true" : "false";
    },
    ...mapActions("pos/admin/products-manager", ["getProducts"])
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
  async mounted() {
    if (await this.getProducts()) {
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

