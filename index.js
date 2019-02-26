const argv = require('minimist')(process.argv.slice(2))
const async = require('async')
const _ = require('lodash')
const { spawn } = require('child_process');
const fs = require('fs')

const payloadFile = _.get(argv, 'payload', './tmp/payload.json')
const schemaFile = _.get(argv, 'schema', './tmp/schema.js')
const pathToPayload = _.get(argv, 'pathToPayload', 'hits.hits')
const pathToProperties = _.get(argv, 'pathToProperties', '_source')

let payload
let schema

if (_.get(argv, 'help')) {
  console.log('SHOWING HELP')
  console.log('')
  console.log('Usage: node index.js --payload FILE --schema FILE [--pathToPayload STRING] [--pathToProperties STRING]')
  console.log('')
  console.log('--payload JSON file with payload')
  console.log('--schema Schema file as JS')
  console.log('--pathToPayload Path to payload in the JSON file, e.g. hits.hits for ES response')
  console.log('--pathToProperties Path to properties for each entry in payload, e.g. _source for ES response')
  console.log('')
  process.exit(0)
}

async.series({
  loadPayload: (done) => {
    fs.readFile(payloadFile, 'utf-8', (err, result) => {
      if (err) return done(err)
      try {
        payload = JSON.parse(result)
      }
      catch(e) {
        console.error(e)
      }
      if (pathToPayload) {
        payload = _.get(payload, pathToPayload)
      }
      console.log('Checking %s items in total', _.size(payload))
      console.log(_.repeat('-', 80))
      return done()
    })
  },
  loadSchema: (done) => {
    schema = require(schemaFile)
    return done()
  },
  checkPayload: (done) => {
    _.forEach(payload, item => {
      if (pathToProperties) item = _.get(item, pathToProperties)
      console.log('Checking item %s', _.get(item, schema.identifierPath))
      //console.log('%j', item)
      _.forEach(schema.fields, field => {
        let value = _.get(item, field.property) 
        if (!value) {
          console.log('Property %s missing on item %s', field.property, _.get(item, schema.identifierPath))
          return true
        }
        if (!field.type(value)) {
          console.log('Property %s is not type %s on item %s', field.property, field.type, _.get(item, schema.identifierPath))
          return true
        }
        if (_.get(field, 'enum') && _.indexOf(_.get(field, 'enum'), value) < 0) {
          console.log('Property %s is %s but not of %j on item %s', field.property, value, field.enum, _.get(item, schema.identifierPath))
          return true
        }
      })
      console.log(_.repeat('-', 80))
    })
    return done()
  }
}, (err) => {
  if (err) console.error(err)
  process.exit(0)
})
