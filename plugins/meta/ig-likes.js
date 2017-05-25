module.exports = {

    getMeta: function(og) {

        return {
            likes: og.description ? og.description.match(/^(\d+) Likes/)[1] : "n/a",
        };
    }
};
