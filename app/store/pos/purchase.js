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
    async purchaseCheck({commit, state, rootState}) {
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
    async purchaseCreate({commit, state, rootState}, data) {
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
            // SlackBotへの発信
            // let details = [];
            // let total = 0;
            // state.cart.forEach((product) => {
            //     details.push({value: product.name});
            //     details.push({value: "×"+product.quantity+" (@"+product.price+")", short:true});
            //     details.push({value: "¥"+(product.price * product.quantity), short: true});
            //     total += product.price * product.quantity;
            // });    
            // const now = await $nuxt.dateFormat(new Date, "YYYY年MM月DD日 (E) hh:mm");
        
            // await this.$axios({
            //     method: "POST",
            //     url: "https://slack.com/api/chat.postMessage",
            //     headers: {
            //         "Content-Type": "application/json;charset=UTF-8",
            //         "Access-Control-Allow-Origin": "*",
            //         "Authorization": "Bearer " + process.env.SLACK_RECEIPT_API_TOKEN
            //     },
            //     data: {
            //         channel: process.env.SLACK_RECEIPT_API_CHANNEL,
            //         username: "Sweets 決済Bot",
            //         icon_url: '',
            //         text: "Thank you for shoppig :tada:",
            //         attachments: [
            //             {
            //                 title: process.env.SHOP_NAME,
            //                 fields: [
            //                     {
            //                         value: now
            //                     },
            //                     {
            //                         value: "決済UUID"
            //                     }
            //                 ]
            //             },
            //             {
            //                 title: "---------------お買い上げ明細---------------",
            //                 fields: [
            //                     ...details,
            //                     {
            //                         title: "合計",
            //                         short: true
            //                     },
            //                     {
            //                         value: "¥"+total,
            //                         short: true
            //                     }
            //                 ]
            //             }
            //         ],

            //     }
            // }).catch(err => {
            //     console.error("Cant send to slack bot receipt");
            // })
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
