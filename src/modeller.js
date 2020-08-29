class myAzureSource {
    constructor(devOpsEnumBuilder, attachmentMappers, releaseMappers, environmentMappers) {
        this.devOpsEnumBuilder = devOpsEnumBuilder;
        this.attachmentMappers = attachmentMappers;
        this.releaseMappers = releaseMappers;
        this.environmentMappers = environmentMappers;
    }

    generateSourceConnections() {
        return new Promise((resolve, reject) => {
            resolve(enumerateAzureReleases(this.devOpsEnumBuilder, this.attachmentMappers, this.releaseMappers, this.environmentMappers))
        });
    }
}

async function modelAzureReleases(devOpsEnumBuilder, entModellerBuilder, attachmentMappers, releaseMappers, environmentMappers) {
    var enumerator = devOpsEnumBuilder.build();

    var modeller = entModellerBuilder        
        .addSource("Azure", new myAzureSource(enumerator, attachmentMappers, releaseMappers, environmentMappers), null)
        .build();

    let output = await modeller.generateOutput();
    console.log(output);
}

async function enumerateAzureReleases(devOpsEnumBuilder, attachmentMappers, releaseMappers, environmentMappers) {
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

    return results;
}

module.exports = modelAzureReleases;