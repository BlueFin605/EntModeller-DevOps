class myAzureSource {
    constructor(enumerator, attachmentMappers) {
        this.enumerator = enumerator;
        this.attachmentMappers = attachmentMappers;
    }

    generateSourceConnections() {
        return new Promise((resolve, reject) => {
            resolve(enumerateAzureReleases(this.enumerator, this.attachmentMappers))
        });
    }
}

async function modelAzureReleases(enumerator, entModellerBuilder, attachmentMappers) {
    var modeller = entModellerBuilder        
        .addSource("Azure", new myAzureSource(enumerator, attachmentMappers), null)
        .build();

    let output = await modeller.generateOutput();
    console.log(output);
}

async function enumerateAzureReleases(enumerator, attachmentMappers) {
    let releases = await enumerator.enumerateDevOps()

    console.log('---------------------------------------------------------------')
    console.log(JSON.stringify(releases));
    console.log('---------------------------------------------------------------')

    let releasesWithAttachments = releases.filter(r => r.attachments.size > 0);

    let results = [];

    attachmentMappers.forEach(mapper => {
        let matches = releasesWithAttachments.filter(r => r.attachments.has(mapper.id));
        matches.forEach(m => {
            let attachment = m.attachments.get(mapper.id);
            results = results.concat(mapper.mapper(m.release, attachment, m.environment));
        });
    });

    return results;
}

module.exports = modelAzureReleases;