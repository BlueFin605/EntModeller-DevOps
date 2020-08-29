var devopsmodeller = require('../src/modeller.js')
var ent = require('@bluefin605/entmodeller')

const DevOpsModeller = (function () {
    const _private = new WeakMap()

    const internal = (key) => {
        // Initialize if not created
        if (!_private.has(key)) {
            _private.set(key, {})
        }
        // Return private properties object
        return _private.get(key)
    }

    class DevOpsModeller {
        constructor(enumerator, entModellerBuilder, attachmentMappers) {
            internal(this).enumerator = enumerator;
            internal(this).entModellerBuilder = entModellerBuilder;
            internal(this).attachmentMappers = attachmentMappers;
        }

        static get Builder() {
            class Builder {
                constructor() {
                    internal(this).attachmentMappers = [];
                    internal(this).entModellerBuilder = new ent.EntModeller.Builder();
                }

                setEnumerator(enumerator) {
                    internal(this).enumerator = enumerator;
                    return this
                }

                addEntityOverrides(overrides) {
                    internal(this).entModellerBuilder.addEntityOverrides(overrides);
                    return this
                }

                addEntityFills(fills) {
                    internal(this).entModellerBuilder.addEntityFills(fills);
                    return this
                }

                addRelationshipFills(fills) {
                    internal(this).entModellerBuilder.addRelationshipFills(fills);
                    return this
                }

                outputAsDOTDefaultServices(styles) {
                    internal(this).entModellerBuilder.outputAsDOTDefaultServices(styles);
                    return this
                }

                outputAsDOT(serviceShapes, styles) {
                    internal(this).entModellerBuilder.outputAsDOT(serviceShapes, styles);
                    return this
                }

                addAttachmentMapping(id, mapper) {
                    internal(this).attachmentMappers.push({id: id, mapper: mapper});
                    return this;
                }

                build() {
                    var tracer = new DevOpsModeller(internal(this).enumerator, internal(this).entModellerBuilder, internal(this).attachmentMappers);
                    return tracer;
                }
            }

            return Builder
        }

        async modelDevOps() {
            let results = devopsmodeller(internal(this).enumerator, internal(this).entModellerBuilder, internal(this).attachmentMappers);
            return results;
        }
    }

    return DevOpsModeller
}())

module.exports = {
    Builder: DevOpsModeller.Builder,
    json: require('./JsonHelpers')
 }