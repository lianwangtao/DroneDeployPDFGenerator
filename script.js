const tileLinks = []
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
  .then(getLinks)
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

function getLinks(linkURL) {
  for (const imgUrl in linkURL) {
    tileLinks.push(imgUrl)
  }
}

function addImagetoPDF() {
  console.log(`Adding image`)
  for (const url in tileLinks) {
    getBase64Image(url, (dataUrl) => {
      console.log('Data Url:', dataUrl)
      doc.addImage(dataUrl, 'png', 0, 0, 50, 50)
    })
  }
}

function getBase64Image(img, callback) {
  console.log("converting iamge")
  var image = new Image()
  image.src = img
  var canvas = document.createElement('canvas')
  image.onload = function () {
    canvas.width = this.naturalWidth
    canvas.height = this.naturalHeight
    console.log("Width", canvas.width)
    console.log("Height", canvas.height)
    canvas.getContext('2d').drawImage(this, 0, 0)
    // ... or get as Data URI
    callback(canvas.toDataURL(img).replace(/^data:image\/(png|jpg);base64,/, ''))
   };
}
