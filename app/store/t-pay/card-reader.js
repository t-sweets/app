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
    resetIDM(state) {
        state.idm = null;
    },

    setReading(state, bool) {
        state.isReading = bool
    }
    
}

export const actions = {
    async startCardReader({commit, dispatch}) {
        dispatch("emissionLED", "waiting")
        await commit("setReading", true);
    },
    async stopCardReader({commit, dispatch}) {
        dispatch("emissionLED")
        await commit("setReading", false);
    },
    /**
     * カードリーダを起動
     */
    async execCardReader({commit, state, dispatch}) {
        dispatch("emissionLED", "waiting")
        const response = await this.$axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                // ...this.$store.state.auth
            },
            url: process.env.IDM_READER_HOST + "api/v1/card",
            timeout : 5000,
        }).catch(err => {
            commit("setReading", false)
            return err.response
        })
        
        if (!response) {
            await dispatch("emissionLED", "error")
            await commit("setReading", false)
            return false
        }
        if (response.status == 200) {
            await commit("setIDM", response.data.idm)
            await commit("setReading", false)
            dispatch("emissionLED", "success")
            setTimeout(() => {
                dispatch("emissionLED")
            }, 50000);
            return true
        } else if (response.status == 204) {
            return "continue"
        } else {
            await commit("setReading", false)
            await dispatch("emissionLED", "error")
            return false
        }
    },


    /**
     * カードリーダのモニタへメッセージを表示
     */
    async showMessage({commit, state}, texts) {

        commit("setText", {line_1: texts[0] ? texts[0] : "", line_2: texts[1] ? texts[1] : "" })

        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                // ...this.$store.state.auth
            },
            url: process.env.IDM_READER_HOST + "api/v1/message",
            data: state.displayText,
            timeout : 5000,
        }).catch(err => {
            return false
        })

        if (response.status == 201) {
            return true
        } else return false
    },

    /**
     * カードリーダのモニタへメッセージを表示
     */
    async emissionLED({commit, state}, mode) {

        if (!mode) mode = "destroy";

        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
            url: process.env.IDM_READER_HOST + "api/v1/led",
            data: {
                mode: mode
            },
            timeout : 5000,
        }).catch(err => {
            return false
        })
    },
}