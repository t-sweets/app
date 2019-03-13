<template>
  <sweet-modal ref="productInfo" width="80%" :title="`「${product.name}」の詳細情報`">
    <sweet-modal-tab title="基本情報" id="basicdata" :disabled="isConfirm || isEdit">
      <div class="main">
        <el-form ref="form" :model="form" label-width="200px" label-position="left" size="small">
          <el-form-item label="商品名">
            <p class="form-text">{{ product.name }}</p>
          </el-form-item>
          <el-form-item label="商品画像">
            <el-col :span="11">
              <img :src="toImageUrl" class="product-confirm-image">
            </el-col>
          </el-form-item>
          <el-form-item label="在庫数">
            <p class="form-text">{{ product.stock }}&nbsp;個</p>
          </el-form-item>
          <el-form-item label="販売価格">
            <p class="form-text">{{ product.price }}&nbsp;円</p>
          </el-form-item>
          <el-form-item label="原価（入荷時価格）">
            <p class="form-text">{{ product.cost }}&nbsp;円</p>
          </el-form-item>
          <el-form-item label="在庫通知">
            <p
              class="form-text"
            >{{product.notification ? "残り在庫数が" + product.notification_stock + "個以下で通知" : "通知しない"}}</p>
          </el-form-item>
          <el-form-item label="表示">
            <p class="form-text">{{product.display ? "表示する" : "表示しない"}}</p>
          </el-form-item>
        </el-form>
      </div>
    </sweet-modal-tab>
    <sweet-modal-tab title="売価変更履歴" id="price-history" :disabled="isConfirm || isEdit">
      <div class="main"></div>
    </sweet-modal-tab>
    <sweet-modal-tab title="商品情報変更" id="edit" :disabled="!isEdit">
      <div class="main">
        <el-form ref="form" :model="form" label-width="200px" label-position="left">
          <el-form-item label="商品名" :required="true">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="商品" :required="true">
            <el-col :span="11">
              <el-upload
                class="product-image-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="convertToBase64"
              >
                <img v-if="!isChangedImage" :src="toImageUrl" class="product-image">
                <img v-if="isChangedImage" :src="toImageData" class="product-image">
                <i class="el-icon-plus product-image-uploader-icon"></i>
              </el-upload>
            </el-col>
          </el-form-item>
          <el-form-item label="販売価格" :required="true">
            <el-col :span="11">
              <el-input-number v-model="form.price" :min="0" :max="999"></el-input-number>
            </el-col>
          </el-form-item>
          <el-form-item label="原価" :required="true">
            <el-col :span="11">
              <el-input-number v-model="form.cost" :min="0" :max="999"></el-input-number>
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
            <el-col :span="11">
              <el-switch v-model="form.display" active-text="表示する" inactive-text="表示しない"></el-switch>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </sweet-modal-tab>
    <sweet-modal-tab title="変更情報確認" id="confirm" :disabled="!isConfirm">
      <div class="main" v-if="!isDelete">
        <el-form ref="form" :model="form" label-width="200px" label-position="left" size="small">
          <el-form-item label="商品名">
            <el-col :span="8">
              <p class="form-text">{{ product.name }}</p>
            </el-col>
            <el-col class="line" :span="2">=></el-col>
            <el-col :span="11">
              <p class="form-text" style="font-weight:bold;">{{ form.name }}</p>
            </el-col>
          </el-form-item>
          <el-form-item label="画像（変更前 => 変更後）">
            <el-col :span="8">
              <img :src="toImageUrl" class="product-confirm-image">
            </el-col>
            <el-col class="line" :span="2">=></el-col>
            <el-col :span="11" v-if="isChangedImage">
              <img :src="toImageData" class="product-confirm-image">
            </el-col>
            <el-col :span="11" v-if="!isChangedImage">
              <img :src="toImageUrl" class="product-confirm-image">
            </el-col>
          </el-form-item>
          <el-form-item label="在庫数（変更前 => 変更後）">
            <el-col :span="5">
              <p class="form-text">{{ product.stock }}&nbsp;個</p>
            </el-col>
            <el-col class="line" :span="2">=></el-col>
            <el-col :span="11">
              <p class="form-text" style="font-weight:bold;">{{ form.stock }}&nbsp;個</p>
            </el-col>
          </el-form-item>
          <el-form-item label="販売価格（変更前 => 変更後）">
            <el-col :span="5">
              <p class="form-text">{{ product.price }}&nbsp;円</p>
            </el-col>
            <el-col class="line" :span="2">=></el-col>
            <el-col :span="11">
              <p class="form-text" style="font-weight:bold;">{{ form.price }}&nbsp;円</p>
            </el-col>
          </el-form-item>
          <el-form-item label="原価（変更前 => 変更後）">
            <el-col :span="5">
              <p class="form-text">{{ product.cost }}&nbsp;円</p>
            </el-col>
            <el-col class="line" :span="2">=></el-col>
            <el-col :span="11">
              <p class="form-text" style="font-weight:bold;">{{ form.cost }}&nbsp;円</p>
            </el-col>
          </el-form-item>
          <el-form-item label="在庫通知">
            <p
              class="form-text"
            >{{form.notification ? "残り在庫数が" + form.notification_stock + "個以下で通知" : "通知しない"}}</p>
          </el-form-item>
          <el-form-item label="表示">
            <p class="form-text">{{form.display ? "表示する" : "表示しない"}}</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="main" v-if="isDelete">
        <img style="margin: 0 auto;" :src="toImageUrl" class="product-confirm-image">
        <br>
        <p style="font-size:20px;">
          <span style="font-weight:bold;">{{product.name}}</span>を削除しますか？
        </p>
        <br>
        <p style="color:red;">注意：過去の取引情報にエラーが発生する場合があります。
          <br>慎重に操作してください。
        </p>
      </div>
    </sweet-modal-tab>

    <sweet-button slot="button">
      <el-button v-if="!isConfirm && !isEdit" type="info" plain @click="edit">情報変更</el-button>
      <el-button v-if="!isConfirm && !isEdit" type="primary" @click="$refs.productInfo.close()">閉じる</el-button>
      <el-button v-if="isEdit" type="danger" @click="preDelete" plain style="float:left;">商品の削除</el-button>
      <el-button v-if="isEdit" type="info" plain @click="backView">キャンセル</el-button>
      <el-button v-if="isEdit" type="primary" @click="confirm">確認</el-button>
      <el-button v-if="isConfirm" type="info" plain @click="backEdit">戻る</el-button>
      <el-button v-if="isConfirm && !isDelete" type="primary" @click="execUpdate">変更</el-button>
      <el-button v-if="isConfirm && isDelete" type="danger" @click="execDelete">削除</el-button>
    </sweet-button>
  </sweet-modal>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      isEdit: false,
      isConfirm: false,
      isDelete: false,
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
      this.isEdit = false;
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
      this.$refs.productInfo.open("basicdata");
    },
    edit() {
      this.isEdit = true;
      this.isConfirm = false;
      this.$refs.productInfo.open("edit");
    },
    backView() {
      this.isEdit = false;
      this.isConfirm = false;
      this.$refs.productInfo.open("basicdata");
    },
    confirm() {
      this.isEdit = false;
      this.isConfirm = true;
      this.$refs.productInfo.open("confirm");
    },
    preDelete() {
      this.isEdit = false;
      this.isDelete = true;
      this.isConfirm = true;
      this.$refs.productInfo.open("confirm");
    },
    backEdit() {
      this.isEdit = true;
      this.isConfirm = false;
      this.$refs.productInfo.open("edit");
    },
    async execUpdate() {
      let data = { stock: this.form.stock };
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
        this.$refs.productInfo.close();
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
    async execDelete() {
      await this.$confirm("本当に消去してよろしいですか？", "Warning", {
        confirmButtonText: "削除する",
        cancelButtonText: "キャンセル",
        type: "warning"
      }).then(async () => {
        if (await this.deleteProduct(this.product.id)) {
          this.$message({
            type: "success",
            message: "削除しました"
          });
        } else {
          this.$message({
            type: "error",
            message: "エラーが発生しました"
          });
        }
      });
    },
    convertToBase64(file) {
      let fr = new FileReader();
      fr.onload = evt => {
        this.form.image = evt.target.result.split("base64,")[1];
        this.form.image_path = file.name;
      };
      fr.readAsDataURL(file);
    },
    ...mapActions("pos/admin/products-manager", [
      "updateProduct",
      "deleteProduct"
    ])
  },
  computed: {
    toImageUrl() {
      return this.product.image_path
        ? this.product.image_path.match(
            /^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/
          )
          ? this.product.image_path
          : process.env.POS_HOST + "/../.." + this.product.image_path
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
.main {
  height: 450px;
  overflow-y: scroll;
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
      position: absolute;
      width: 178px;
      height: 178px;
      display: block;
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

p.form-text {
  padding-left: 20px;
  text-align: left;
}
</style>

<style lang="scss">
.el-form-item__content {
  text-align: left;
}
</style>

