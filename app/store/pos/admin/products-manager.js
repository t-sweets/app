export const state = () => ({
    products: []
});

export const mutations = {
    setProducts(state, products) {
        state.products = products;
    },
    updateProduct(state, data) {
        state.products.some((product, index) => {
            if (product.id == data.id) {
                for(let val in data) {
                    state.products[index][val] = data[val]
                }
            } else return false
        })  
    },

    setStock(state, {id, stock}) {
        state.products.some((product, index) => {
            return product.id == id ? state.products[index].stock = stock : false;
        })
    },

    setDisplay(state, {id, display}) {
        state.products.forEach(product => {
            return product.id == id ? product.display = display : false
        })
    }
    
}

export const actions = {
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

    async setStocks({commit, rootState}, {id, data}) {
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
            // await commit("setStock", {id: response.data.product.id, stock: response.data.product.stock})
            await commit("updateProduct", response.data.product)
            return true
        } else return false
    }
}