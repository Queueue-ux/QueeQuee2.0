// all things related to current time

module.exports = {
    get_current_time() {
        const time = Date.now();
        return time;
    },

    elapsed_time_in_seconds(end, start) {
        const millis = end - start;
        return Math.floor(millis / 1000);
    },
};