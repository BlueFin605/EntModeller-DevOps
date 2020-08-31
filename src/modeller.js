class myAzureSource {
    constructor(devOpsEnumBuilder, attachmentMappers, releaseMappers, environmentMappers, transformers, preflightChecks) {
        this.devOpsEnumBuilder = devOpsEnumBuilder;
        this.attachmentMappers = attachmentMappers;
        this.releaseMappers = releaseMappers;
        this.environmentMappers = environmentMappers;
        this.transformers = transformers
        this.preflightChecks = preflightChecks;
    }

    generateSourceConnections() {
        return new Promise((resolve, reject) => {
            resolve(enumerateAzureReleases(this.devOpsEnumBuilder, this.attachmentMappers, this.releaseMappers, this.environmentMappers, this.transformers, this.preflightChecks))
        });
    }
}

async function modelAzureReleases(devOpsEnumBuilder, entModellerBuilder, attachmentMappers, releaseMappers, environmentMappers, transformers, preflightChecks) {
    var enumerator = devOpsEnumBuilder.build();

    var modeller = entModellerBuilder        
        .addSource("Azure", new myAzureSource(enumerator, attachmentMappers, releaseMappers, environmentMappers, transformers, preflightChecks), null)
        .build();

    let output = await modeller.generateOutput();
    return output;

}

async function enumerateAzureReleases(devOpsEnumBuilder, attachmentMappers, releaseMappers, environmentMappers, transformers, preflightChecks) {
    let releases = await devOpsEnumBuilder.enumerateDevOps()

    // console.log('---------------------------------------------------------------')
    // console.log(JSON.stringify(releases));
    // console.log('---------------------------------------------------------------')

    let releasesWithAttachments = releases.filter(r => r.attachments.size > 0);
    let releasesWithEnvironment = releases.filter(r => r.environment?.variables != null);

    let results = [];

    let payload = preflightChecks?.payload;

    // call preflight checks
    //=======================================================

    preflightChecks.attChecks.forEach(checker => {
        let matches = releasesWithAttachments.filter(r => r.attachments.has(checker.id));
        matches.forEach(m => {
            let attachment = m.attachments.get(checker.id);
            checker.checker(payload, m.release, attachment, m.environment?.variables);
        });
    });

    preflightChecks.envChecks.forEach(checker => {
        releasesWithEnvironment.forEach(m => {
            checker.checker(payload, m.release, m.environment?.variables);
        });
    });

    releaseMappers.forEach(mapper => {
        checker.checker(payload, m.release, m.environment?.variables, r.attachments);
    });

    // call mappers
    //===================================================

    attachmentMappers.forEach(mapper => {
        let matches = releasesWithAttachments.filter(r => r.attachments.has(mapper.id));
        matches.forEach(m => {
            let attachment = m.attachments.get(mapper.id);
            let mapped = mapper.mapper(payload, m.release, attachment, m.environment?.variables);
            if (mapped != null) {
                if (Array.isArray(mapped))
                    results = results.concat(mapped);
                else
                    results.push(mapped);
            }
        });
    });

    environmentMappers.forEach(mapper => {
        releasesWithEnvironment.forEach(m => {
            let mapped = mapper.mapper(payload, m.release, m.environment?.variables);
            if (mapped != null) {
                if (Array.isArray(mapped))
                    results = results.concat(mapped);
                else
                    results.push(mapped);
            }
        });
    });

    releaseMappers.forEach(mapper => {
        let mapped = mapper.mapper(payload, m.release, m.environment?.variables, r.attachments);
        if (mapped != null) {
            if (Array.isArray(mapped))
                results = results.concat(mapped);
            else
                results.push(mapped);
        }
    });

    //transform all the names
    results.forEach(r => {
        transformers.forEach(t => {
            r.from.name = t(r.from.name);
            r.to.name = t(r.to.name);
        })
    });
    return results;
}

module.exports = modelAzureReleases;