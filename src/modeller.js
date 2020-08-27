
async function modelAzureReleases(enumerator, entModellerBuilder) {
    let releases = await enumerator.enumerateDevOps()

    console.log('---------------------------------------------------------------')
    console.log(JSON.stringify(releases));
    console.log('---------------------------------------------------------------')

    return releases;
}

module.exports = modelAzureReleases;