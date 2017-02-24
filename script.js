var zoom = 17;
var layer = 'ortho';
var id = null;

function printOutput(tiles) {
  console.log(`In output`);
}

function fetchTileDataFromPlan(plan){
  console.log(`Plan: `, plan);
  console.log(`API: `, dronedeployApi);
  id = plan.id;
  console.log(`ID: `, id);
  return dronedeployApi.Tiles.get({planId: plan.id.value, layerName: layer.value, zoom: parseInt(zoom.value)});
}

function getTilesFromResponse(tileResponse){
  console.log(`Tile: `, tileResponse.tiles);
  return tileResponse.tiles;
}

function updateTile(){
  new DroneDeploy({version: 1}).then(function(dronedeployApi){
     return dronedeployApi.Plans.getCurrentlyViewed();
  })
  .then(function(plan, dronedeployApi){
    return fetchTileDataFromPlan(plan);
  })
  .then(getTilesFromResponse)
  .then(printOutput);
}
