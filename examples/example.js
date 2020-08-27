var enumBuilder = require('@bluefin605/entmodeller-devops-enumerator')
var ent = require('@bluefin605/entmodeller')
var modellerBuilder = require('../src/Builder.js')

var overides = [{ name: 'queueJ', style: 'styleB', relationshipGroup: 'override', entityGroup: 'entoverride' }, { name: 'serviceE', style: 'styleC', relationshipGroup: 'override' }];

var relFilles = [{ from: 'serviceE', to: 'queueJ', relationshipGroup: 'groupA' }, { from: 'queueJ', to: 'serviceA' }];

var entFilles = [{ name: 'queueW', type: 'queue', entityGroup: 'filledGroup' }];

var styles = {
  styleA: {
    color: 'red',
    fillcolor: 'blue',
    height: 2
  },
  styleB: {
    color: 'green',
    fillcolor: 'orange',
    height: 3
  },
  styleC: {
    color: 'black',
    fillcolor: 'brown',
    height: 4
  }
};

async function enumerateDevOps() {
  let ss = {
    service: ent.EntModeller.DotShapes.rectangle,
    queue: ent.EntModeller.DotShapes.cds,
    database: ent.EntModeller.DotShapes.cylinder,
    lambda: ent.EntModeller.DotShapes.oval,
  }

  var enumerator = new enumBuilder.Builder()
    .setConfigFromFile('examples\\config.json')
    .addDefaultFilter(isDev)
    .build()

  var modeller = new modellerBuilder.Builder()
    .setEnumerator(enumerator)
    .addEntityOverrides(overides)
    .addRelationshipFills(relFilles)
    .addEntityFills(entFilles)
    .outputAsDOTDefaultServices(styles)
    // .outputAsDOT(ss, styles)
    .build();

  modeller.modelDevOps();
}


function isDev(name) {
  return name.toLowerCase().includes("dev");
}

enumerateDevOps();

console.log('bye bye');
