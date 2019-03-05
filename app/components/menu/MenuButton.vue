<template>
  <el-card :body-style="{ padding: '0px' }">
    <div class="product-card" :class="menu.size">
      <div class="title">
        <font-awesome-icon class="card-icon" :icon="menu.icon"/>
        <span>{{ menu.title }}</span>
      </div>
      <div class="description">
        <span>{{ menu.description }}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: ["menu"]
};
</script>

<style lang="scss" scoped>
.el-card {
  margin: 10px;
}
.product-card {
  min-height: 200px;
  display: block;

  .title {
    padding: 0 auto;
    font-size: 35px;
    color: #409eff;
    span {
      margin-left: 15px;
    }
  }
  .description {
    margin-top: 50px;
    color: #999;
  }
  &.big {
    min-height: 38vh;
    .title {
      padding-top: 90px;
    }
  }
  &.small {
    min-height: 20vh;
    .title {
      padding-top: 60px;
      font-size: 28px;
      span {
        margin-left: 15px;
      }
    }
    .description {
      margin-top: 30px;
      padding-bottom: 30px;
    }
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  &:active {
    background: #ddd;
  }
}

.button {
  padding: 0;
  float: right;
}
</style>
