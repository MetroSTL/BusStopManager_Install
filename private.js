var clientId = 'hhibAhdSLrpXfARP';
var redirectUri = 'http://127.0.0.1:5500/';
// var redirectUri = 'https://externalapps.metrostlouis.org/bsm-install';

const jsonURL = (id, token) => `https://metroas08.metrostlouis.org/arcserver/rest/services/Hosted/Install_Survey_Results_Bus_Stop_Manager/FeatureServer/0/query?where=cast%28stopId+as+varchar%2810%29%29+LIKE+%27%25${id}%25'&%28assess_feasible+%3D+%27YES%27%29+OR+%28install_approved+<>+%27YES%27%29&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=xyFootprint&resultOffset=&resultRecordCount=&returnTrueCurves=false&returnCentroid=false&sqlFormat=none&resultType=&datumTransformation=&f=pjson&token=${token}`

const survey_id = 'ad1421bb1d224e129752bba181588dc9'

export { jsonURL, install_config, clientId, redirectUri }
