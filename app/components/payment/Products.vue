<template>
  <el-card :body-style="{ padding: '0px' }">
    <div
      class="product-card"
      @click="add(product.id)"
      :class="{selected: isSelected}"
      :align="styles"
    >
      <img :src="toImageUrl" class="image">
      <div style="padding: 10px;">
        <span class="title">{{ product.name }}</span>
        <div class="bottom clearfix">
          <time class="price">&yen; {{ product.price }}</time>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      quantity: 0
    };
  },
  props: ["product"],
  methods: {
    add(id) {
      this.quantity++;
      this.addCart({
        id: id,
        name: this.product.name,
        quantity: this.quantity,
        price: this.product.price,
        cost: this.product.cost
      });
    },
    addCart(product) {
      this.$emit("addCart", product);
    },
    resetCart() {
      this.quantity = 0;
    }
  },
  computed: {
    styles() {
      return this.quantity > 0 ? this.quantity : "";
    },
    isSelected() {
      return this.quantity > 0;
    },
    toImageUrl() {
      return this.product.image_path.match(
        /^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/
      )
        ? this.product.image_path
        : process.env.POS_HOST + "/../.." + this.product.image_path;
    }
  }
};
</script>

<style lang="scss" scoped>
.selected {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    box-shadow: 0 0 0 3px #81b8e3 inset;
  }
  &::before {
    content: attr(align);
    position: absolute;
    top: 0;
    right: 0;
    color: white;
    padding: 10px 20px;
    font-size: 25px;
    border-radius: 0 0 0 50%;
    background-color: #4b9ad8;
  }
}
.product-card {
  @include pc {
    height: 275px;
  }
  @include tab {
    height: 300px;
  }
  @include sp {
    height: 300px;
  }
  .title {
    @include pc {
      font-size: 18px;
    }
    @include tab {
      font-size: 23px;
    }
    @include sp {
      font-size: 18px;
    }
  }
  .price {
    font-size: 15px;
    color: #999;
  }
  .image {
    object-fit: cover;
    margin: 0 auto;
    display: block;
    @include pc {
      max-height: 200px;
    }
    @include tab {
      max-height: 200px;
    }
    @include sp {
      max-height: 180px;
    }
  }
  .bottom {
    margin-top: 10px;
    line-height: 12px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }
}

.button {
  padding: 0;
  float: right;
}
</style>
