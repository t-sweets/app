<template>
  <sweet-modal ref="arrivalProduct" width="80%" :blocking="true" title="入荷登録">
    <sweet-modal-tab title="入荷情報" id="arrival" :disabled="isConfirm">
      <div class="main">
        <el-form ref="form" :model="form" label-width="150px" label-position="left">
          <el-form-item label="商品名">
            <el-col :span="24">
              <p class="form-text">{{ product.name }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="現在庫数">
            <el-col :span="24">
              <p class="form-text">{{ product.stock }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="入荷数" :required="true">
            <el-col :span="11">
              <el-input-number v-model="form.arrival" :min="0" :max="999"></el-input-number>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </sweet-modal-tab>
    <sweet-modal-tab title="価格変更" id="changeprice" :disabled="isConfirm">
      <div class="main">
        <el-form ref="form" :model="form" label-width="200px" label-position="left">
          <el-form-item label="原価（変更前/変更後）">
            <el-col :span="6">
              <p class="form-text">{{ product.cost }}</p>
            </el-col>
            <el-col class="line" :span="2">/</el-col>
            <el-col :span="16">
              <el-input-number v-model="form.cost" :min="1" :max="9999"></el-input-number>
            </el-col>
          </el-form-item>
          <el-form-item label="販売価格（変更前/変更後）">
            <el-col :span="6">
              <p class="form-text">{{ product.price }}</p>
            </el-col>
            <el-col class="line" :span="2">/</el-col>
            <el-col :span="16">
              <el-input-number v-model="form.price" :min="product.price" :max="9999"></el-input-number>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </sweet-modal-tab>
    <sweet-modal-tab title="商品情報変更" id="changedata" :disabled="isConfirm">
      <div class="main">
        <el-form ref="form" :model="form" label-width="200px" label-position="left">
          <el-form-item label="画像" :required="true">
            <el-col :span="11">
              <el-upload
                class="product-image-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="convertToBase64"
              >
                <img v-if="!isChangedImage" :src="toImageUrl" class="product-image in-arrival">
                <img v-if="isChangedImage" :src="toImageData" class="product-image in-arrival">
                <i class="el-icon-plus product-image-uploader-icon"></i>
              </el-upload>
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
            <el-col :span="11">
              <el-switch v-model="form.display" active-text="表示する" inactive-text="表示しない"></el-switch>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </sweet-modal-tab>
    <sweet-modal-tab title="変更情報確認" id="confirm" :disabled="!isConfirm">
      <div class="main">
        <el-form ref="form" :model="form" label-width="230px" label-position="left">
          <el-form-item label="商品名">
            <p class="form-text">{{ product.name }}</p>
          </el-form-item>
          <el-form-item label="入荷数">
            <p class="form-text" style="font-weight:bold;">{{ form.arrival }}&nbsp;個</p>
          </el-form-item>
          <el-form-item label="入荷後在庫数">
            <p class="form-text">{{ product.stock + form.arrival }}&nbsp;個</p>
          </el-form-item>
          <el-form-item label="原価（変更前 => 変更後）" v-if="isChangedCost">
            <el-col :span="5">
              <p class="form-text">{{ product.cost }}&nbsp;円</p>
            </el-col>
            <el-col class="line" :span="2">=></el-col>
            <el-col :span="11">
              <p class="form-text" style="font-weight:bold;">{{ form.cost }}&nbsp;円</p>
            </el-col>
          </el-form-item>
          <el-form-item label="販売価格（変更前 => 変更後）" v-if="isChangedPrice">
            <el-col :span="5">
              <p class="form-text">{{ product.price }}&nbsp;円</p>
            </el-col>
            <el-col class="line" :span="2">=></el-col>
            <el-col :span="11">
              <p class="form-text" style="font-weight:bold;">{{ form.price }}&nbsp;円</p>
            </el-col>
          </el-form-item>
          <el-form-item label="画像（変更前 => 変更後）" v-if="isChangedImage">
            <el-col :span="11">
              <img :src="toImageUrl" class="product-confirm-image">
            </el-col>
            <el-col class="line" :span="2">=></el-col>
            <el-col :span="11">
              <img :src="toImageData" class="product-confirm-image">
            </el-col>
          </el-form-item>
          <el-form-item label="在庫通知" v-if="isChangedNotification || isChangedNotificationStock">
            <p class="form-text">{{notificationlabel}}</p>
          </el-form-item>
          <el-form-item label="表示" v-if="isChangedDisplay">
            <p class="form-text">{{displaylabel}}</p>
          </el-form-item>
        </el-form>
      </div>
    </sweet-modal-tab>

    <sweet-button slot="button">
      <el-button v-if="!isConfirm" type="info" plain @click="$refs.arrivalProduct.close()">キャンセル</el-button>
      <el-button v-if="!isConfirm" type="primary" @click="confirm">確認</el-button>
      <el-button v-if="isConfirm" type="info" plain @click="backEdit">戻る</el-button>
      <el-button v-if="isConfirm" type="primary" @click="arrivalProduct">登録</el-button>
    </sweet-button>
  </sweet-modal>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      isConfirm: false,
      product: {
        name: "",
        image_path: null
      },
      form: {
        name: "",
        price: 0,
        cost: 0,
        stock: 0,
        display: true,
        image_path: null,
        notification: true,
        notification_stock: 0,
        image: null,
        arrival: 0
      }
    };
  },
  methods: {
    open(id) {
      this.isConfirm = false;
      if (id != undefined) {
        this.products.some(item => {
          return item.id == id ? (this.product = item) : false;
        });
        this.form = {
          arrival: 0,
          ...this.product
        };
      }
      this.$refs.arrivalProduct.open("arrival");
    },
    confirm() {
      this.isConfirm = true;
      this.$refs.arrivalProduct.open("confirm");
    },
    backEdit() {
      this.isConfirm = false;
      this.$refs.arrivalProduct.open("arrival");
    },
    async arrivalProduct() {
      let data = { stock: this.product.stock + this.form.arrival };
      if (this.isChangedCost) data.cost = this.form.cost;
      if (this.isChangedPrice) data.price = this.form.price;
      if (this.isChangedImage)
        (data.image_path = this.form.image_path),
          (data.image = this.form.image);
      if (this.isChangedNotification)
        data.notification = this.form.notification;
      if (this.isChangedNotificationStock)
        data.notification_stock = this.form.notification_stock;
      if (this.isChangedDisplay) data.display = this.form.display;

      if (await this.updateProduct({ id: this.product.id, data: data })) {
        this.$refs.arrivalProduct.close();
        this.$notify({
          title: "Success",
          message: "商品在庫を更新しました",
          type: "success",
          duration: 3000
        });
      } else {
        this.$ons.notification.alert("情報の更新に失敗しました");
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
    ...mapActions("pos/admin/products-manager", ["updateProduct"])
  },
  computed: {
    toImageUrl() {
      return this.product.image_path
        ? this.product.image_path.match(
            /^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/
          )
          ? this.product.image_path
          : process.env.POS_HOST + "product_images/" + this.product.image_path
        : "";
    },
    toImageData() {
      return this.form.image ? "data:image/png;base64," + this.form.image : "";
    },
    isChangedCost() {
      return this.product.cost !== this.form.cost ? true : false;
    },
    isChangedPrice() {
      return this.product.price !== this.form.price ? true : false;
    },
    isChangedImage() {
      return this.product.image_path !== this.form.image_path ? true : false;
    },
    isChangedNotification() {
      return this.product.notification !== this.form.notification
        ? true
        : false;
    },
    isChangedNotificationStock() {
      return this.product.notification_stock !== this.form.notification_stock
        ? true
        : false;
    },
    isChangedDisplay() {
      return this.product.display !== this.form.display ? true : false;
    },
    notificationlabel() {
      return this.form.notification
        ? "在庫数が残り" + this.form.notification_stock + "個になったら通知する"
        : "通知しない";
    },
    displaylabel() {
      return this.form.display ? "表示する" : "表示しない";
    },
    ...mapState("pos/admin/products-manager", ["products"])
  }
};
</script>

<style lang="scss" scoped>
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
    &.in-arrival {
      position: absolute;
    }
  }
}
.product-confirm-image {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style lang="scss">
.el-form-item__content {
  text-align: left;
}

p.form-text {
  padding-left: 20px;
  text-align: left;
}
</style>