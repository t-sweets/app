export const state = () => ({
    products: []
});

export const mutations = {
    setProducts(state, products) {
        state.products = products;
    },
    addProduct(state, product) {
        state.products.push(product);
    },
    updateProduct(state, data) {
        state.products.some((product, index) => {
            if (product.id == data.id) {
                for(let val in data) {
                    state.products[index][val] = data[val]
                }
            } else return false
        })  
    }
}

export const actions = {
    /**
     * 商品情報の一覧を取得
     */
    async getProducts({commit, rootState}) {
        const response = await this.$axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...rootState.pos.admin.auth
            },
            url: process.env.POS_HOST+"api/v1/products",
            timeout: 3000
        })
        .catch(err => {
            return false
        });

        if (response.status == 200) {
            commit("setProducts", response.data)
            return true
        } else {
            return false
        }
    },

    async createProduct({commit, rootState}, data) {
        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...rootState.pos.admin.auth
            },
            url: process.env.POS_HOST+"api/v1/products",
            data: {
                ...data
            },
            timeout: 5000
        }).catch(err => {return false})

        if (response.status == 200 && response.data.success) {
            return await commit("addProduct", response.data.product)
        } else return false;
    },

    async updateProduct({commit, rootState}, {id, data}) {
        const response = await this.$axios({
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...rootState.pos.admin.auth
            },
            url: process.env.POS_HOST+"api/v1/products/"+id,
            data: {
                ...data
            },
            timeout: 1000
        }).catch(err => {
            return false
        })

        if (response.status == 200 && response.data.success) {
            await commit("updateProduct", response.data.product)
            return true
        } else return false
    }
}