<template>
  <sweet-modal ref="createProduct" width="80%" :blocking="true" title="商品登録">
    <div class="main">
      <el-form ref="form" :model="form" label-width="150px" label-position="left">
        <el-form-item label="商品名" :required="true">
          <el-col :span="24">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="販売価格/原価" :required="true">
          <el-col :span="11">
            <el-input-number v-model="form.price" :min="1" :max="9999" :step="10"></el-input-number>
          </el-col>
          <el-col class="line" :span="2">/</el-col>
          <el-col :span="11">
            <el-input-number v-model="form.cost" :min="10" :max="9999"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="画像" :required="true">
          <el-col :span="11">
            <el-upload
              class="product-image-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="convertToBase64"
            >
              <img v-if="form.image" :src="form.image" class="product-image">
              <i v-else class="el-icon-plus product-image-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="在庫数" :required="true">
          <el-col :span="11">
            <el-input-number v-model="form.stock" :min="0" :max="999"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="在庫通知/通知個数">
          <el-col :span="5">
            <el-switch v-model="form.notification"></el-switch>
          </el-col>
          <el-col class="line" :span="2">/</el-col>
          <el-col :span="11">
            <el-input-number v-model="form.notification_stock" :min="0" :max="99"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="表示">
          <el-col :span="5">
            <el-switch v-model="form.display"></el-switch>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <sweet-button slot="button">
      <el-button type="info" plain @click="$refs.createProduct.close()">キャンセル</el-button>
      <el-button type="primary" @click="close">登録</el-button>
    </sweet-button>
  </sweet-modal>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      form: {
        name: "",
        price: 0,
        cost: 0,
        stock: 0,
        display: true,
        image_path: null,
        notification: true,
        notification_stock: 0,
        image: null
      }
    };
  },
  methods: {
    open() {
      this.$refs.createProduct.open();
    },
    async close() {
      await this.createProduct(form);
      this.$refs.createProduct.close();
    },
    convertToBase64(file) {
      let fr = new FileReader();
      fr.onload = evt => {
        this.form.image = evt.target.result;
        this.form.image_path = file.name;
      };
      fr.readAsDataURL(file);
    },
    ...mapActions("pos/admin/products-manager", ["createProduct"])
  }
};
</script>

<style lang="scss">
.product-image-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
    }
  }
  .product-image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .product-image {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
