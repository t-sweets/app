export const state = () => ({
    users: []
});

export const mutations = {
    setUsers(state, users) {
        state.users = users;
    },
    createUser(state, data) {
        state.users.push(data)
    },
    updateUser(state, data) {
        state.users.some((user, index) => {
            if (user.id == data.id) {
                for(let val in data) {
                    state.users[index][val] = data[val]
                }
            } else return false
        })
    }
}

export const actions = {
    async getUsers({commit, rootState}) {
        const response = await this.$axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...rootState.pos.admin.auth
            },
            url: process.env.POS_HOST+"/users",
            timeout: 3000
        })
        .catch(err => {
            return false
        });

        if (response.status == 200) {
            await commit("setUsers", response.data)
            return true
        } else {
            return false
        }
    },

    async createUser({commit, rootState}, data) {
        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...rootState.pos.admin.auth
            },
            url: process.env.POS_HOST+"/auth",
            data: {
                ...data
            },
            timeout: 3000
        })
        .catch(err => {
            return false
        });

        if (response.status == 200 && response.data.status == "success") {
            await commit("createUser", response.data.data)
            return true
        } else {
            return false
        }
    },

    /**
     * update user datas
     * @param {*} data update datas
     */
    async updateUser({commit, rootState}, {id, data}) {
        if (Object.keys(data).length === 0) return true;
        const response = await this.$axios({
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...rootState.pos.admin.auth
            },
            url: process.env.POS_HOST+"/auth",
            data: {
                id: id,
                ...data
            },
            timeout: 3000
        })
        .catch(err => {
            return false
        });

        if (response.status == 200 && response.data.success) {
            await commit("updateUser", response.data.product)
            return true
        } else {
            return false
        }
    },

    async deleteUser({commit, rootState}, id){
        return true
    }
}