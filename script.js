// Author: Shane Lian
let _ddApi = null

/*
  Main function invoked by onclick handler in view
  Initialize jsPDF doc and update Tile information
  params: None
*/
function downloadPDF() {
  const doc = new jsPDF()
  _updateTile()
  doc.save("Map.pdf")
}

/*
  Initialize DroneDeploy Api and invoke chained API calls for getting Tile information
  params: None
*/
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

/*
  Helper function to make GET request for Tiles
  params: plan - the plan Currently being viewed
*/
function _fetchTileDataFromPlan(plan) {
  const layer = 'ortho'
  const zoom = 17

  return _ddApi.Tiles.get({
    planId: plan.id,
    layerName: layer,
    zoom: parseInt(zoom)
  })
}

/*
  Helper function to return Tile image URLs from promise
  params: tileResponse - Response returned by the GET request
*/
function _getTilesFromResponse(tileResponse) {
  return tileResponse.tiles
}

/*
  Helper function to add converted image DataURL to the doc
  params: linkURL - an array of Tile image URLs
*/
function _addImagetoPDF(linkURL) {
  for (let i = 0; i < linkURL.length; i++) {
    _getBase64ImageViaURL(linkURL[i], function(dataURL) {
      doc.addImage(dataURL, 'PNG', 10, 50)
    })
  }
}

/*
  Method 1 for converting image URL to image Base64 DataURL via FileReader
  params: url - the link to be converted
          callback - callback function to get the result
*/
function _convertFileToDataURLviaFileReader(url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.cors = '*'
  xhr.onload = function() {
    const reader = new FileReader()
    reader.onloadend = function() {
      callback(reader.result)
    }
    reader.readAsDataURL(xhr.response)
  }
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.send()
}

/*
  Method 2 for converting image URL to image Base64 DataURL via HTML Canvas
  params: url - the link to be converted
          callback - callback function to get the result
*/
function _getBase64ImageViaURL(url, callback) {
  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.onload = function() {
    const canvas = document.createElement('CANVAS')
    const ctx = canvas.getContext('2d')
    let dataURL
    canvas.height = this.height
    canvas.width = this.width
    ctx.drawImage(this, 0, 0)
    dataURL = canvas.toDataURL('image/png')
    callback(dataURL)
    canvas = null
  }
  img.src = url
}
