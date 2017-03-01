// Author: Shane Lian
let _ddApi = null

function downloadPDF() {
  const doc = new jsPDF()
  _updateTile()
  doc.save("Map.pdf")
}

function _updateTile() {
  new DroneDeploy({version: 1}).then(function(dronedeployApi) {
    _ddApi = dronedeployApi
    return dronedeployApi.Plans.getCurrentlyViewed()
  })
  .then(function(plan){
    return _fetchTileDataFromPlan(plan)
  })
  .then(_getTilesFromResponse)
  .then(_addImagetoPDF)
}

function _fetchTileDataFromPlan(plan) {
  const layer = 'ortho'
  const zoom = 17

  return _ddApi.Tiles.get({
    planId: plan.id,
    layerName: layer,
    zoom: parseInt(zoom)
  })
}

function _getTilesFromResponse(tileResponse) {
  return tileResponse.tiles
}

function _addImagetoPDF(linkURL) {
  for (let i = 0; i < linkURL.length; i++) {
    _getBase64ImageViaURL(linkURL[i], function(dataURL) {
      console.log("DataURL", dataURL)
    })
  }
}

function _convertFileToDataURLviaFileReader(url, callback) {
  console.log("URL:", url)
  var xhr = new XMLHttpRequest()
  xhr.cors = '*'
  xhr.onload = function() {
    var reader = new FileReader()
    reader.onloadend = function() {
      callback(reader.result)
    }
    reader.readAsDataURL(xhr.response)
  }
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.send()
}

function _getBase64ImageViaURL(url, callback, outputFormat) {
  var img = new Image()
  img.crossOrigin = 'Anonymous'
  img.onload = function() {
    var canvas = document.createElement('CANVAS')
    var ctx = canvas.getContext('2d')
    var dataURL
    canvas.height = this.height
    canvas.width = this.width
    ctx.drawImage(this, 0, 0)
    dataURL = canvas.toDataURL(outputFormat || 'image/png')
    callback(dataURL)
    canvas = null
  }
  img.src = url
}
