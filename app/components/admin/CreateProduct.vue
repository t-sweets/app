<template>
  <sweet-modal ref="createProduct" width="80%" :blocking="true" title="商品登録">
    <div class="main">
      <el-form ref="form" :model="form" label-width="150px" label-position="left">
        <el-form-item label="商品名" :required="true">
          <el-col :span="24">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="JANコード" :required="true">
          <el-col :span="24">
            <el-input id="janForm" v-model="form.jan"></el-input>
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
              <img v-if="form.image || form.image_path" :src="toImageData" class="product-image">
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
          <el-col :span="8">
            <el-switch active-text="通知する" inactive-text="通知しない" v-model="form.notification"></el-switch>
          </el-col>
          <el-col class="line" :span="2">/</el-col>
          <el-col :span="11">
            <el-input-number
              v-model="form.notification_stock"
              :min="0"
              :max="99"
              :disabled="!form.notification"
            ></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="表示">
          <el-switch v-model="form.display" active-text="表示する" inactive-text="表示しない"></el-switch>
        </el-form-item>
      </el-form>
    </div>
    <sweet-button slot="button">
      <el-button type="info" plain @click="formReset()" style="float:left;">リセット</el-button>
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
        jan: "",
        price: 100,
        cost: 100,
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
      if (this.$nuxt.jancodeValidate(this.form.jan)) {
        await this.createProduct(this.form);
        this.$emit("reset-list");
        this.$emit("getProductList");
        this.$refs.createProduct.close();
      }
    },
    convertToBase64(file) {
      let fr = new FileReader();
      fr.onload = evt => {
        this.form.image = evt.target.result.split("base64,")[1];
        this.form.image_path = file.name;
      };
      fr.readAsDataURL(file);
    },
    formReset() {
      this.form = {
        name: "",
        jan: "",
        price: 100,
        cost: 100,
        stock: 0,
        display: true,
        image_path: null,
        notification: true,
        notification_stock: 0,
        image: null
      };
    },
    ...mapActions("pos/admin/products-manager", [
      "createProduct",
      "getProductInfo"
    ])
  },
  computed: {
    toImageData() {
      return this.form.image
        ? "data:image/png;base64," + this.form.image
        : this.form.image_path;
    }
  },
  mounted() {
    document.getElementById("janForm").addEventListener("keydown", async e => {
      if (e.keyCode === 13 && this.$nuxt.jancodeValidate(this.form.jan)) {
        const data = await this.getProductInfo(this.form.jan);
        if (!data) return false;
        if (this.form.name == "") this.form.name = data.Name;
        if (this.form.image_path == null)
          this.form.image_path = data.Image.Medium;
      }
    });
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
