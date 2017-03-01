const layer = 'ortho'
const zoom = 17
const doc = new jsPDF()
let ddApi = null

function downloadPDF() {
  updateTile()
  //doc.save("Map.pdf")
}

function updateTile(){
  new DroneDeploy({version: 1}).then(function(dronedeployApi){
    ddApi = dronedeployApi
    return dronedeployApi.Plans.getCurrentlyViewed()
  })
  .then(function(plan){
    return fetchTileDataFromPlan(plan)
  })
  .then(getTilesFromResponse)
  .then(addImagetoPDF)
}

function fetchTileDataFromPlan(plan){
  return ddApi.Tiles.get({
    planId: plan.id,
    layerName: layer,
    zoom: parseInt(zoom)
  })
}

function getTilesFromResponse(tileResponse){
  return tileResponse.tiles
}

function addImagetoPDF(linkURL) {
  for (var i = 0, len = linkURL.length; i < len; i++) {
    convertFileToDataURLviaFileReader(linkURL[i], function(dataURL) {
      console.log("DataURL", dataURL)
    })
  }
}

function convertFileToDataURLviaFileReader(url, callback) {
  console.log("URL", url)
  var xhr = new XMLHttpRequest()
  xhr.crossOrigin = 'Anonymous'
  xhr.onload = function() {
    var reader = new FileReader()
    reader.onloadend = function() {
      callback(reader.result)
    }
    reader.readAsDataURL(xhr.response)
  };
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.send()
}


function getBase64Image(url, callback, outputFormat) {
  console.log("URL", url)
  var img = new Image();
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
