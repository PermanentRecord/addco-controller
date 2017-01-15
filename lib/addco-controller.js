require('dotenv').config()

const rp = require('request-promise')

rp.defaults({
  followAllRedirects: true,
  jar: true
})

const cheerio = require('cheerio')

// Scraper / controller for ADDCO lighting sign via Mirasan gateways.

class AddcoController {

  constructor () {
    this.jar = rp.jar()
  }

  authenticate (username, password) {
    return new Promise((resolve, reject) => {
      // First, snag the AuditId.
      rp({
        'jar': true,
        'url': `${process.env.BASE_URL}/Account/SignIn?url=%2f`
      })
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

          return rp.post({
            'url': `${process.env.BASE_URL}/Account/SignIn?url=%2f`,
            'form': form,
            'jar': true,
            'followAllRedirects': true
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

  addMessage (message, divisionId, cmsId) {
    return new Promise((resolve, reject) => {
      // First, fetch the page containing the AuditId.
      let url = `${process.env.BASE_URL}/Cms/AddMessage?divisionId=${divisionId}&cmsId=${cmsId}&fromChangeMessagePage=True`
      rp({
        'url': url,
        'jar': true
      })
        .then((body) => {
          let $ = cheerio.load(body)
          let form = $('input')
          let auditId

          form.each((i, el) => {
            let id = $(el).attr('id')
            if (id === 'AuditId') {
              let val = $(el).attr('value')
              auditId = val
            }
          })

          if (auditId) {
            rp({
              'url': `${process.env.BASE_URL}/Cms/SaveMessageSubmit`,
              'method': 'POST',
              'jar': true,
              'form': {
                'AuditId': auditId,
                'divisionId': divisionId,
                'messageId': '',
                'messageTextRaw': message,
                'categoryName': 'category',
                'cmsId': cmsId,
                'fromChangeMessagePage': true,
                'activationPriority': '',
                'runtimePriority': ''
              }
            })
              .then((data) => {
                return resolve()
              })
              .catch((e) => {
                return reject(e)
              })
          } else {
            return reject('Could not find AuditId')
          }
        })
        .catch((e) => {
          console.log('e', e)
        })
    })
  }

  getMessageList (divisionId, cmsId) {
    return new Promise((resolve, reject) => {
      // Fetch the AuditId
      rp({
        'url': `${process.env.BASE_URL}/Cms/MessageList?divisionId=${divisionId}&cmsId=${cmsId}`,
        'jar': true
      })
      .then((body) => {
        let $ = cheerio.load(body)
        let inputs = $('input')
        let auditId
        inputs.each((i, el) => {
          let key = $(el).attr('id')
          if (key === 'AuditId') {
            auditId = $(el).attr('value')
          }
        })

        rp({
          'url': `${process.env.BASE_URL}/Cms/MessageListJson`,
          'jar': true,
          'method': 'POST',
          'form': {
            'page': 0,
            'sortExp': '',
            'sortDesc': 'false',
            'auditId': auditId,
            'divisionId': divisionId,
            'cmsId': cmsId,
            'categories': 425,
            'showUncategorized': 'true',
            'search': ''
          }
        })
        .then((d) => {
          d = JSON.parse(d)
          d.Html = d.Html.replace(/[\r|\n|\t]+/gi, '')
          let $ = cheerio.load(d.Html)
          let trs = $('tr')
          let messages = []
          trs.each((i, el) => {
            let o = {
              rowId: $(el).attr('data-rowid'),
              linkURL: $(el).attr('data-linkurl'),
              text: $(el).find('td:nth-child(3)').text()
            }
            messages.push(o)
          })
          return resolve(messages)
        })
        .catch((e) => {
          return reject(e)
        })
      })
      .catch((e) => {
        return reject(e)
      })
    })
  }

  // Used for retrieving the controllable signs in a given area.
  // Hardcoded Minneapolis for the time being.
  // TODO - Pass in relevant configuration for other areas.
  getArea () {
    return new Promise((resolve, reject) => {
      rp({
        'url': `${process.env.BASE_URL}/MapNew/MapDataJson`,
        'method': 'POST',
        'jar': true,
        'headers': {
          'Content-Type': 'application/json; charset=utf-8'
        },
        // This is Minneapolis / St. Paul area.
        'body': JSON.stringify(
          {
            'MinLatitude': 44.82305804522849, // from map.
            'MaxLatitude': 45.152317906524104, // from map.
            'MinLongitude': -93.73914201663206, // from map.
            'MaxLongitude': -92.75311906741331, // from map.
            'Zoom': 11, // from map.
            'Query': '',
            'DivisionIds': [901, 3018], // ?
            'EntityTypes': [2, 10], // ?
            'ShowPlannedIssues': false,
            'GisSystemId': null,
            'TimestampLocal': null,
            'ShowCmsPreviews': false,
            'ShowCameraPreviews': true,
            'PreviewIssueLocations': null,
            'ExcludeEntityId': ''
          }
         )
      }).then((d) => {
        return resolve(JSON.parse(d))
      }).catch((e) => {
        return reject(e)
      })
    })
  }
}

module.exports = AddcoController
