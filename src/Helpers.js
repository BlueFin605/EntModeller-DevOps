module.exports = {
    allChildren: function (json, filter) {
        if (json == null)
            return [];

        let found = filter(json);
        if (found == null)
            return [];

        return Object.values(found);
    }
}