
// Consumes a stream & updates ADDCO traffic signs.

const AddcoController = require('./lib/addco-controller')
const acc = new AddcoController()

let area // The data for the geographic area we're working with.

acc.authenticate(process.env.USERNAME, process.env.PASSWORD)
  .then(() => {
    console.log('Authenticated.')
    // Request the information for a given area.
    acc.getArea()
      .then((d) => {
        area = d
        let boardIds = d.Layer.MIds
        let board = boardIds[0]
        let boardIdComponents = board.split('|')
        let divisionId = boardIdComponents[2]
        let cmsId = boardIdComponents[1]

        // Now, either add a message or get a message list.
      })
      .catch((e) => {
        console.log(e)
      })
  })
  .catch((e) => {
    console.log('e', e)
  })
