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
    setQuantity(state, {index, quantity}) {
        state.cart[index].quantity = quantity
    },
    /*
     ** カートを初期化する
     */
    resetProduct (state) {
        state.cart = []
    }


}

export const actions = {
    async purchaseCheck({commit, getters, rootState}) {
        const products = getters.getPurchasesProducts

        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...rootState.pos.auth
            },
            url: process.env.POS_HOST + "/purchases/check",
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
    async purchaseCreate({commit, getters, rootState}, data) {
        const products = getters.getPurchasesProducts

        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...rootState.pos.auth
            },
            url: process.env.POS_HOST + "/purchases",
            data: {
                products: products,
                payment_method_id: data.id,
                payment_uuid: data.uuid
            },
            timeout : 5000,
        }).catch(err => {
            return false
        })

        if (response.status == 201) {
            
            return true;
        } else return false;
    },

    async chargeCreate({state, rootState}, {payment_method_id, amount}) {
        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...rootState.pos.auth
            },
            url: process.env.POS_HOST + "/charges",
            data: {
                payment_method_id: payment_method_id, 
                amount: amount,
            },
            timeout : 5000,
        }).catch(err => {
            return false
        })

        if (response.status == 201, response.data.success) {
            return true;
        } else return false;
    },

    async getQuantity({state}, id) {
        const product = await state.cart.filter(item => {
            return item.id == id
        })
        return product.length ? product[0].quantity : 0;
    }

}

export const getters = {
    getPurchasesProducts(state) {
        let products = [];
        state.cart.some((product) => {
            products.push({
                "product_id": product.id,
                ...product
            })
        })
        console.log(products);
        
        return products;
    }
}
