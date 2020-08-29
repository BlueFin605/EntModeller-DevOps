module.exports = {
    allChildren: function (json, filter) {
        if (json == null)
            return [];

        let found = filter(json);
        if (found == null)
            return [];

        return Object.values(found);
    },

    findValues: function(object, key) {
        if (object === null || object === undefined)
            return [];
    
        if (typeof object !== 'object')
            return [];
    
        let toAdd = Object.entries(object).filter(([fkey, fval]) => key.includes(fkey)).map(([mkey, mval]) => {
            return mval;
        });
    
        Object.values(object).some(s => {
            toAdd = toAdd.concat(findValues(s, key));
        });
        return toAdd;
    },

    containsValue: function(object, key) {
        let lKey = key.toLowerCase();
    
        if (object === null || object === undefined)
            return false;
    
        if (typeof object === 'string') {
            let loVal = object.toLowerCase();
            if (loVal.includes(lKey))
                return true;
    
            return false;
        }
    
        if (typeof object !== 'object')
            return false;
    
    
        let hasKey = Object.entries(object).some(([okey, oval]) => {
            let loKey = okey.toLowerCase();
            if (loKey.includes(lKey))
                return true;
    
            let hasSubKey = containsValue(oval, key);
            if (hasSubKey)
                return true;
    
            return false;
        });
    
        return hasKey;
    },
    
    hasKeyStartsWith: function(object, key) {
        let lKey = key.toLowerCase();
    
        if (object === null || object === undefined)
            return false;
    
        if (typeof object !== 'object')
            return false;
    
        let hasKey = Object.entries(object).some(([okey, oval]) => {
            let loKey = okey.toLowerCase();
            if (loKey.startsWith(lKey))
                return true;
    
            let hasSubKey = hasKeyStartsWith(oval, key);
            if (hasSubKey)
                return true;
    
            return false;
        });
    
        return hasKey;
    }
}