export const state = () => ({
    uuid: null,
    cart: []
});

export const mutations = {
    setUUID (state, uuid) {
        state.uuid = uuid
    },

    /*
     ** カートに商品を追加する
     */
    setProduct (state, product) {
        state.cart.push(product)
    },
    /*
     ** カートから商品を削除する
     */
    removeProduct (state, index) {
        state.cart.splice(index, 1)
    },
    /*
     ** 商品の数量を設定する
     */
    setQuantity(state, data) {
        state.cart[data.index].quantity = data.quantity
    },
    /*
     ** カートを初期化する
     */
    resetProduct (state) {
        state.cart = []
    }


}

export const actions = {
    async purchaseCheck({commit, state}) {
        let products = [];
        state.cart.some((product, index) => {
            products.push({
                "product_id": product.id,
                "price": product.price
            })
        })

        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                // ...this.$store.state.auth
            },
            url: "http://localhost:3000/api/v1/purchases/check",
            data: {
                products: products
            },
            timeout : 2000,
        }).catch(err => {
            return false
        })

        if (response.status == 200) return true;
        else return false;
    },
    /**
     * 
     * @param {*} data payment method data
     */
    async purchaseCreate({commit, state}, data) {
        let products = [];
        state.cart.some((product) => {
            products.push({
                "product_id": product.id,
                ...product
            })
        })

        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                // ...this.$store.state.auth
            },
            url: "http://localhost:3000/api/v1/purchases",
            data: {
                products: products,
                payment_method: data.id,
                payment_uuid: data.uuid
            },
            timeout : 5000,
        }).catch(err => {
            return false
        })

        if (response.status == 201) return true;
        else return false;
    }
}