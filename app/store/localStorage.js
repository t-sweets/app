export const state = () => ({
    extraConfig: {
        reader_ip: "",
    }
})

export const mutations = {
    saveReaderIp: (state, ip) => {
        state.extraConfig.reader_ip = ip
    }
}

export const getters = {
    getReaderIp: (state) => {
        return state.extraConfig.reader_ip;
    }
}