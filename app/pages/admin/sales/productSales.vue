<template>
  <v-ons-page>
    <div class="aggregation-target">
      <span>分析対象</span>
      <el-date-picker
        v-model="searchForm.date"
        type="daterange"
        unlink-panels
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
        size="small"
        :picker-options="pickerOptions"
        @change="searchExec"
      ></el-date-picker>

      <!-- <el-button plain style="margin-left: 100px;" size="small" @click="searchExec">表示する</el-button> -->
    </div>
    <!-- <el-table
      class="manage-list"
      :data="dateForTable"
      :default-sort="{prop: 'period', order: 'ascending'}"
      style="width: 100%"
    >
      <el-table-column prop="period" label="集計期間" sortable>
        <template slot-scope="scope">
          <p>{{toStrDate(scope.row.period)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="sales" label="売上"></el-table-column>
      <el-table-column prop="counts" label="会計数"></el-table-column>
      <el-table-column prop="avarage" label="会計単価">
        <template slot-scope="scope">
          <p>¥{{Math.round(scope.row.avarage)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="販売商品数"></el-table-column>
      <el-table-column label="詳細">
        <template slot-scope="scope">
          <el-button type="text" size="mini">詳細</el-button>
        </template>
      </el-table-column>
    </el-table>-->
  </v-ons-page>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      searchForm: {
        date: [
          new Date(new Date().getTime() - 3600 * 1000 * 24 * 30),
          new Date()
        ]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "先週",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "先月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "過去３カ月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  methods: {
    test() {
      console.log(this.searchForm.date);
    },
    searchExec() {
      if (
        this.getProductSales({
          from: this.searchForm.date[0],
          to: this.searchForm.date[1]
        })
      ) {
      }
    },
    ...mapActions("pos/admin/sales-manager", ["getProductSales"])
  },
  mounted() {
    this.searchExec();
  }
};
</script>


<style lang="scss" scoped>
.aggregation-target {
  background-color: #ddd;
  width: 95vw;
  margin: 10px auto;
  padding: 10px;
  border-radius: 2px;
  text-align: left;
  span {
    margin: 0px 20px;
  }
  .el-select {
    width: 100px;
  }
  .el-range-separator {
    width: none;
  }
}
</style>

<style lang="scss">
.aggregation-target {
  span {
    &.el-range-separator {
      width: auto;
    }
  }
}
</style>

