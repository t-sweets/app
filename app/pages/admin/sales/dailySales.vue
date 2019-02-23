<template>
  <v-ons-page>
    <div class="aggregation-target">
      <span>集計対象</span>
      <el-select v-model="searchForm.target" placeholder="Select" size="small">
        <el-option
          v-for="item in target_list"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
  </v-ons-page>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        target: null,
        year: null,
        month: null
      },
      target_list: [
        {
          value: "time",
          label: "時間別"
        },
        {
          value: "date",
          label: "日別"
        },
        {
          value: "month",
          label: "月別"
        },
        {
          value: "year",
          label: "年別"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.aggregation-target {
  background-color: #eee;
  width: 95vw;
  margin: 10px auto;
  padding: 10px;
  border-radius: 5px;
  text-align: left;
  span {
    margin: 0px 20px;
  }
  .el-select {
    width: 100px;
  }
}
</style>

