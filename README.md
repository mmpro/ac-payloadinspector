# AC Payload Inspector
A simple tool that inspects JSON payload for properties.

# Usage
```
node index.js --payload FILE --schema FILE [--pathToPayload STRING] [--pathToProperties STRING]
```

Options
+ pathToPayload - path to payload in JSON file (e.g. hits.hits for ES response)
+ pathToProperties - path to properties in each item of JSON file (e.g. _source in ES response)

# Schema File
The schema file contains information on the expected properties and the path to the property that shall be used as identifier in console.logs

### Example
```
const _ = require('lodash')

module.exports = {
  identifierPath: 'id',
  fields: [
    { property: 'type', type: _.isString, enum: ['image', 'video'] },
    { property: 'id', type: _.isInteger },
    { property: 'createdAt', type: _.isString },
    { property: 'updatedAt', type: _.isString },
    { property: 'settings', type: _.isObject },
    { property: 'container_name', type: _.isString },
    { property: 'meta_copyright', type: _.isString },
    { property: 'container_description', type: _.isString },
    { property: 'links', type: _.isArray },
  ]
}
```

# Payload File
This is an example payload file from an ES response

```
{  
  "took":2,
  "timed_out":false,
  "hits":{  
     "total":1234,
     "max_score":1,
     "hits":[  
        {  
           "_index":"myindex",
           "_type":"item",
           "_id":"12345",
           "_score":1,
           "_source":{  
              "container_name":"My demo content"
           }
        }
     ]
  }
}
```

"pathToPayload" must be set to hits.hits as we want to inspect the hits array. "pathToProperties" must be set to "_source" as the actual payload per item is not on root of each hit but within the _source object.

# Installation
Install this tool using "npm install ac-payloadInspector"

# Links
- [Website](https://www.admiralcloud.com/)
- [Twitter (@admiralcloud)](https://twitter.com/admiralcloud)
- [Facebook](https://www.facebook.com/MediaAssetManagement/)

# License
[MIT License](https://opensource.org/licenses/MIT) Copyright © 2009-present, AdmiralCloud, Mark Poepping
