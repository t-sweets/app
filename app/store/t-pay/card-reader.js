export const state = () => ({
    idm: "",
    displayText: {
        line_1: "",
        line_2: ""
    },
    isReading: false
});

export const mutations = {
    setText(state, array) {
        state.displayText = array
    },

    setIDM(state, idm) {
        state.idm = idm
    },

    setStatus(state, bool) {
        state.isReading = bool
    }
}

export const actions = {
    async execCardReader({commit, state}, texts) {

        commit("setStatus", true)
        commit("setText", {line_1: texts[0] ? texts[0] : "", line_2: texts[1] ? texts[1] : "" })

        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                // ...this.$store.state.auth
            },
            url: "http://192.168.133.140:8000/api/v1/card_read/",
            data: {
                "message": state.displayText
            },
            timeout : 30000,
        }).catch(err => {
            commit("setStatus", false)
            if (err.indexOf('timeout') < -1)
            return false
        })

        if (response.status == 201) {
            commit("setIDM", response.data.idm)
            commit("setStatus", false)
            return true
        } else {
            commit("setStatus", false)
            return false
        }
    },

    async showMessage({commit, state}, texts) {

        commit("setText", {line_1: texts[0] ? texts[0] : "", line_2: texts[1] ? texts[1] : "" })

        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                // ...this.$store.state.auth
            },
            url: "http://192.168.133.140:8000/api/v1/message/",
            data: state.displayText,
            timeout : 3000,
        }).catch(err => {
            return false
        })

        if (response.status == 201) {
            return true
        } else return false
    }
}