<template>
  <el-card :body-style="{ padding: '0px' }">
    <div class="menus-button" :class="menu.size">
      <div class="title">
        <font-awesome-icon v-if="menu.icon" class="card-icon" :icon="menu.icon"/>
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
.menus-button {
  @include pc {
    min-height: 200px;
  }
  @include sp {
    min-height: 160px;
  }
  display: block;

  .title {
    padding: 0 auto;
    @include pc {
      font-size: 35px;
      line-height: 140px;
    }
    @include tab {
      font-size: 30px;
      line-height: 140px;
    }
    @include sp {
      font-size: 20px;
      line-height: 100px;
    }
    color: #409eff;

    span {
      margin-left: 15px;
    }
  }

  .description {
    color: #999;
  }

  &.big {
    min-height: 40vh;
    .title {
      padding-top: 100px;
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
