//
// function fetchTileDataFromPlan(api, plan){
//   console.log(`Plan: `, plan);
//   console.log(`API: `, api);
//   id = plan.id;
//   console.log(`ID: `, id);
//   return api.Tiles.get({planId: plan.id.value, layerName: layer.value, zoom: parseInt(zoom.value)});
// }
//
// function getTilesFromResponse(tileResponse){
//   console.log(`Tile: `, tileResponse.tiles);
//   return tileResponse.tiles;
// }
//
// function updateTile(){
//   new DroneDeploy({version: 1}).then(function(dronedeployApi){
//      return dronedeployApi.Plans.getCurrentlyViewed();
//   })
//   .then(function(plan){
//     console.log(`API in then: `, dronedeployApi)
//     return fetchTileDataFromPlan(dronedeployApi, plan);
//   })
//   .then(getTilesFromResponse)
//   .then(printOutput);
// }

function getPlan() {
  return new DroneDeploy({version: 1}).then(function(dronedeployApi){
    return dronedeployApi.Plans.getCurrentlyViewed()
  })
}

function downloadPDF() {
  var doc = new jsPDF();
  doc.text(20, 20, 'Hello world!');
  doc.save('CurrentMap.pdf');
}
