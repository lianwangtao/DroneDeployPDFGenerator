const tileLinks = []
const layer = 'ortho'
const zoom = 17

function downloadPDF() {
  const doc = new jsPDF()
  updateTile()
  console.log(`titles #item: `, tileLinks.length)
  for (const url in tileLinks) {
    doc.addImage(url, 'JPEG', 15, 40, 180, 180)
  }
  doc.save('CurrentMap.pdf')
}

let dronedeployApiZ = null

function updateTile(){
  new DroneDeploy({version: 1}).then(function(dronedeployApi){
    dronedeployApiZ = dronedeployApi
    return dronedeployApi.Plans.getCurrentlyViewed()
  })
  .then(function(plan){
    return fetchTileDataFromPlan(dronedeployApiZ, plan)
  })
  .then(getTilesFromResponse)
  .then(getLinks)
}

function fetchTileDataFromPlan(api, plan){
  console.log(`PlanId: `, plan.id)
  console.log(`Layer: `, layer)
  console.log(`zoon: `, zoom)
  console.log(`API: `, api)

  return api.Tiles.get({
    planId: plan.id,
    layerName: layer,
    zoom: parseInt(zoom)
  })
}

function getTilesFromResponse(tileResponse){
  console.log(`Get tiles from response`)
  return tileResponse.tiles
}

function getLinks(linkURL) {
  console.log(`linkURL: `, linkURL)
}
