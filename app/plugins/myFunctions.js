import Vue from 'vue'

Vue.mixin({
    methods: {
        dateFormat: (date, format) => {
            if (!format) {
                format = 'YYYY/MM/DD(E) hh:mm:ss'
            }
            const weekday = ["日", "月", "火", "水", "木", "金", "土"];
            format = format.replace(/YYYY/g, date.getFullYear());
            format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
            format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
            format = format.replace(/E/g, weekday[date.getDay()]);
            format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
            format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
            format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
            return format;
        }
    }
});
