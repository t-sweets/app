<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center">在庫管理</div>
      <div class="right">
        <span>{{ user.name }}</span>
      </div>
    </v-ons-toolbar>

    <el-table
      :data="old_products"
      :default-sort="{prop: 'id', order: 'ascending'}"
      style="width: 100%"
    >
      <el-table-column prop="id" label="id" sortable width="80"></el-table-column>
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="price" label="Price" sortable width="150"></el-table-column>
      <el-table-column prop="stock" label="Stock" sortable width="150"></el-table-column>
      <el-table-column prop="cost" label="Cost" sortable width="150"></el-table-column>
      <el-table-column prop="display" label="Display" sortable width="100">
        <template slot-scope="scope">
          <el-switch
            :value="scope.row.display"
            @change="setDisplay({
                id: scope.row.id,
                display: !scope.row.display
            })"
            active-color="#13ce66"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>

    <div class="tabber">
      <div class="contents tabber-contents">
        <el-row class="middle-center">
          <el-col :span="4">
            <el-button class="tab-button">商品を追加する</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="tab-button">Default</el-button>
          </el-col>
          <el-col :span="12">
            <div style="width:100%;height:10px;"></div>
          </el-col>
          <el-col :span="4">
            <el-button class="tab-button" type="primary" @click="resetCart()">保存する</el-button>
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
      products: []
    };
  },
  computed: {
    new_products: {
      get() {
        return this.old_products;
      },
      set(value) {
        console.log(value);
      }
    },
    ...mapState("pos/admin", ["user"]),
    ...mapState("pos/admin/products-manager", {
      old_products: state => state.products
    })
  },
  methods: {
    ...mapActions("pos/admin/products-manager", ["getProducts"]),
    ...mapMutations("pos/admin/products-manager", ["setDisplay"])
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
</style>

<style lang="scss" scoped>
.toolbar {
  .right {
    > * {
      margin-right: 10px;
    }
  }
}
</style>