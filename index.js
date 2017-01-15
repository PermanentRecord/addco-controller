

// Consumes a stream & updates ADDCO traffic signs.

const WarningLightsController = require('./lib/warning-lights')
const wlc = new WarningLightsController()

wlc.authenticate(process.env.USERNAME, process.env.PASSWORD)
  .then(() => {
    // Request the information for a given area.
    wlc.getArea()
      .then((d) => {
        console.log('d', d)
      })
      .catch((e) => {
        console.log(e)
      })
  })
  .catch((e) => {
    console.log('e', e)
  })
