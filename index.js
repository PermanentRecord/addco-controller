
// Consumes a stream & updates ADDCO traffic signs.

const WarningLightsController = require('./lib/warning-lights')
const wlc = new WarningLightsController()

let area
let board

wlc.authenticate(process.env.USERNAME, process.env.PASSWORD)
  .then(() => {
    console.log('Authenticated.')
    // Request the information for a given area.
    wlc.getArea()
      .then((d) => {
        console.log('Received area data.')
        /**
        { Layer:
         { Coords: 'gbtqGbvvuP{xZj{dA`s{@djq@q~k@_kVn`b@cyVvnCkme@}bM`tCqcTtal@',
           MIdGrps: [ '10|{}|901', 'uuvyHeF_^o_@yB}WgC' ],
           MIds: [ '2|5201602|3018' ],
           MImgIds: 'kA??????|@',
           PlIdGrps: [],
           PlIds: [],
           PlDetails: [],
           PgIdGrps: [],
           PgIds: [],
           PgDetails: [],
           Overlays: [] },
           Weather: null }
        **/
        area = d
        let boardIds = d.Layer.MIds
        let board = boardIds[0]
        let boardIdComponents = board.split("|")
        let divisionId = boardIdComponents[2]
        let cmsId = boardIdComponents[1]

        let message = "[pt25o0][jp2][jl2][fo442][sc1]THIS IS[nl1][jl2][fo442][sc1]A SAMPLE[nl1][jl2][fo442][sc1]MESSAGE[nl1][jl2][fo442][sc1]COOL!"
        wlc.addMessage(message,divisionId,cmsId)
      })
      .catch((e) => {
        console.log(e)
      })
  })
  .catch((e) => {
    console.log('e', e)
  })
