require('dotenv').config()

const rp = require('request-promise')
const cheerio = require('cheerio')

rp.defaults({
  followAllRedirects: true
})

console.log(rp.defaults())

// Scraper / controller for ADDCO lighting sign via Mirasan gateways.

class WarningLightsController {
  authenticate (username, password) {
    return new Promise((resolve, reject) => {
      // First, snag the AuditId.
      rp('https://warninglites.addco360.com/Account/SignIn?url=%2f')
        .then((rsp) => {
          let $ = cheerio.load(rsp)
          let inputs = $('input')
          let form = {}

          // Serialize the inputs from the initial login page.
          // We'll need the AuditId hidden input value to login.
          inputs.each((i, el) => {
            form[$(el).attr('name')] = $(el).attr('value')
          })

          // Augment request w/ supplied credentials.
          form['Username'] = username
          form['Password'] = password

          return rp.post('https://warninglites.addco360.com/Account/SignIn?url=%2f', {
            form: form,
            followAllRedirects: true
          })
            .then((d) => {
              return resolve(d)
            })
            .catch((e) => {
              return reject(e)
            })
        })
        .catch((e) => {
          console.log('Error while fetching AuditId', e)
          return reject(e)
        })
    })
  }

  // Used for retrieving the controllable signs in a given area.
  // Hardcoded Minneapolis for the time being.
  // TODO - Pass in relevant configuration for other areas.
  getArea () {
    return new Promise((resolve, reject) => {
      rp.post('https://warninglites.addco360.com/MapNew/MapDataJson', {
        form: {
        	'MinLatitude': 44.82305804522849, // from map.
        	'MaxLatitude': 45.152317906524104, // from map.
        	'MinLongitude': -93.73914201663206, // from map.
        	'MaxLongitude': -92.75311906741331, // from map.
        	'Zoom': 11, // from map.
        	'Query': '',
        	'DivisionIds': [901, 3018],
        	'EntityTypes': [2, 10],
        	'ShowPlannedIssues': false,
        	'GisSystemId': null,
        	'TimestampLocal': null,
        	'ShowCmsPreviews': false,
        	'ShowCameraPreviews': true,
        	'PreviewIssueLocations': null,
        	'ExcludeEntityId': ''
        }
      }).then((d) => {
        console.log('d', d)
      }).catch((e) => {
        console.log('err')
      })
    })
  }
}

module.exports = WarningLightsController
