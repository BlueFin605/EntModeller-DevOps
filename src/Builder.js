var devopsmodeller = require('./modeller.js')
var ent = require('@bluefin605/entmodeller')
var enumBuilder = require('@bluefin605/entmodeller-devops-enumerator')

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
        constructor(devOpsEnumBuilder, entModellerBuilder, attachmentMappers, releaseMappers, environmentMappers, transformers) {
            internal(this).devOpsEnumBuilder = devOpsEnumBuilder;
            internal(this).entModellerBuilder = entModellerBuilder;
            internal(this).attachmentMappers = attachmentMappers;
            internal(this).releaseMappers = releaseMappers;
            internal(this).environmentMappers = environmentMappers;
            internal(this).transformers = transformers;
        }

        static get Builder() {
            class Builder {
                constructor() {
                    internal(this).attachmentMappers = [];
                    internal(this).environmentMappers = [];
                    internal(this).releaseMappers = [];
                    internal(this).transformers = [];
                    internal(this).entModellerBuilder = new ent.EntModeller.Builder();
                    internal(this).devOpsEnumBuilder = new enumBuilder.Builder();
                }

                addNameTransformation(transform) {
                    internal(this).transformers.push(transform);
                    return this;
                }

                addAttachmentMapping(id, mapper) {
                    internal(this).attachmentMappers.push({id: id, mapper: mapper});
                    return this;
                }

                addReleaseMapping(mapper) {
                    internal(this).releaseMappers.push({mapper: mapper});
                    return this;
                }

                addEnvironmentMapping(mapper) {
                    internal(this).environmentMappers.push({mapper: mapper});
                    return this;
                }

                //===============================================================================================
                // DevOps devOpsEnumBuilder builders
                setConfigFromFile(filename) {
                    internal(this).devOpsEnumBuilder.setConfigFromFile(filename);
                    return this
                }

                setPersonalAccessToken(pat) {
                    internal(this).devOpsEnumBuilder.setPersonalAccessToken(pat);
                    return this
                }

                setOrgaization(organization) {
                    internal(this).devOpsEnumBuilder.setOrgaization(organization);
                    return this
                }

                setProject(project) {
                    internal(this).devOpsEnumBuilder.setProject(project);
                    return this
                }

                addDefaultFilter(nameParser) {
                    internal(this).devOpsEnumBuilder.addDefaultFilter(nameParser);
                    return this
                }
                
                addAttachment(id, filename, filter, mapper) {
                    internal(this).devOpsEnumBuilder.addAttachment(id, filename, filter, mapper);
                    return this
                }


                //===============================================================================================
                // EntModeller builders
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

                build() {
                    var tracer = new DevOpsModeller(internal(this).devOpsEnumBuilder, internal(this).entModellerBuilder, internal(this).attachmentMappers, internal(this).releaseMappers, internal(this).environmentMappers, internal(this).transformers);
                    return tracer;
                }
            }

            return Builder
        }

        async modelDevOps() {
            let results = devopsmodeller(internal(this).devOpsEnumBuilder, internal(this).entModellerBuilder, internal(this).attachmentMappers, internal(this).releaseMappers, internal(this).environmentMappers, internal(this).transformers);
            return results;
        }
    }

    return DevOpsModeller
}())

module.exports = {
    Builder: DevOpsModeller.Builder,
    mappers: require('./Helpers'),
    DotShapes: ent.DotShapes
 }