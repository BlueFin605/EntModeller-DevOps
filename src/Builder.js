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
        constructor(devOpsEnumBuilder, entModellerBuilder, attachmentMappers, releaseMappers, environmentMappers, transformers, preflightChecks) {
            internal(this).devOpsEnumBuilder = devOpsEnumBuilder;
            internal(this).entModellerBuilder = entModellerBuilder;
            internal(this).attachmentMappers = attachmentMappers;
            internal(this).releaseMappers = releaseMappers;
            internal(this).environmentMappers = environmentMappers;
            internal(this).transformers = transformers;
            internal(this).preflightChecks = preflightChecks;
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
                    internal(this).PreflightBuilder = new PreflightBuilder();
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

                addPreflightChecks(initial, checks) {
                    internal(this).PreflightBuilder.setInitialPayload(initial);
                    checks(internal(this).PreflightBuilder);
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

                useDefaultFilter(nameParser) {
                    internal(this).devOpsEnumBuilder.useDefaultFilter(nameParser);
                    return this
                }
                
                addAttachment(id, filename, filter, responseType) {
                    internal(this).devOpsEnumBuilder.addAttachment(id, filename, filter, responseType);
                    return this
                }

                retrieveEnvironmentVariables() {
                    internal(this).devOpsEnumBuilder.retrieveEnvironmentVariables();
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
                    var tracer = new DevOpsModeller(internal(this).devOpsEnumBuilder, internal(this).entModellerBuilder, internal(this).attachmentMappers, internal(this).releaseMappers, internal(this).environmentMappers, internal(this).transformers, internal(this).PreflightBuilder.build());
                    return tracer;
                }
            }

            class PreflightBuilder {
                constructor() {
                    internal(this).attachmentChecks = [];
                    internal(this).environmentChecks = [];
                    internal(this).releaseChecks = [];
                }

                setInitialPayload(initialValue) {
                    internal(this).initialValue = initialValue;
                    return this;
                }

                addAttachmentChecks(id, checker) {
                    internal(this).attachmentChecks.push({id: id, checker: checker});
                    return this;
                }

                addReleaseChecks(checker) {
                    internal(this).releaseChecks.push({checker: checker});
                    return this;
                }

                addEnvironmentChecks(checker) {
                    internal(this).environmentChecks.push({checker: checker});
                    return this;
                }

                build() {
                    return {
                        payload: internal(this).initialValue, 
                        envChecks: internal(this).environmentChecks, 
                        attChecks: internal(this).attachmentChecks, 
                        relChecks: internal(this).releaseChecks
                    }
                }
            }

            return Builder
        }

        async modelDevOps() {
            let results = devopsmodeller(internal(this).devOpsEnumBuilder, internal(this).entModellerBuilder, internal(this).attachmentMappers, internal(this).releaseMappers, internal(this).environmentMappers, internal(this).transformers, internal(this).preflightChecks);
            return results;
        }
    }

    return DevOpsModeller
}())

module.exports = {
    Builder: DevOpsModeller.Builder,
    mappers: require('./Helpers'),
    DotShapes: ent.EntModeller.DotShapes
 }