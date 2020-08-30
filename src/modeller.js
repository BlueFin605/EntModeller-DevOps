class myAzureSource {
    constructor(devOpsEnumBuilder, attachmentMappers, releaseMappers, environmentMappers, transformers) {
        this.devOpsEnumBuilder = devOpsEnumBuilder;
        this.attachmentMappers = attachmentMappers;
        this.releaseMappers = releaseMappers;
        this.environmentMappers = environmentMappers;
        this.transformers = transformers
    }

    generateSourceConnections() {
        return new Promise((resolve, reject) => {
            resolve(enumerateAzureReleases(this.devOpsEnumBuilder, this.attachmentMappers, this.releaseMappers, this.environmentMappers, this.transformers))
        });
    }
}

async function modelAzureReleases(devOpsEnumBuilder, entModellerBuilder, attachmentMappers, releaseMappers, environmentMappers, transformers) {
    var enumerator = devOpsEnumBuilder.build();

    var modeller = entModellerBuilder        
        .addSource("Azure", new myAzureSource(enumerator, attachmentMappers, releaseMappers, environmentMappers, transformers), null)
        .build();

    let output = await modeller.generateOutput();
    return output;

}

async function enumerateAzureReleases(devOpsEnumBuilder, attachmentMappers, releaseMappers, environmentMappers, transformers) {
    let releases = await devOpsEnumBuilder.enumerateDevOps()

    // console.log('---------------------------------------------------------------')
    // console.log(JSON.stringify(releases));
    // console.log('---------------------------------------------------------------')

    let releasesWithAttachments = releases.filter(r => r.attachments.size > 0);
    let releasesWithEnvironment = releases.filter(r => r.environment?.variables != null);

    let results = [];

    attachmentMappers.forEach(mapper => {
        let matches = releasesWithAttachments.filter(r => r.attachments.has(mapper.id));
        matches.forEach(m => {
            let attachment = m.attachments.get(mapper.id);
            results = results.concat(mapper.mapper(m.release, attachment, m.environment?.variables));
        });
    });

    environmentMappers.forEach(mapper => {
        releasesWithEnvironment.forEach(m => {
            results = results.concat(mapper.mapper(m.release, m.environment?.variables));
        });
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