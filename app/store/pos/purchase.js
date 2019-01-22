export const state = () => ({
    uuid: null,
    products: []
});

export const mutations = {
    setUUID (state, uuid) {
        state.uuid = uuid
    },
    setProducts (state, products) {
        state.products = products;
    }
}

export const actions = {
    
}