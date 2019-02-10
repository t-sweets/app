export const state = () => ({
    products: [],
    old: []
});

export const mutations = {
    setProducts(state, products) {
        state.products = products;
        state.old = products;
    },

    setDisplay(state, {id, display}) {
        state.products.forEach(product => {
            if (product.id == id) {
                product.display = display
                return true
            } else return false
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
            url: "http://localhost:3000/api/v1/products",
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
    }
}