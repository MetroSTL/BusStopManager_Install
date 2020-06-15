const jsonURL = (id) => {
    let assessment = 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/ArcGIS/rest/services/service_834b037efc2b4f58a2e6ca08298d8686/FeatureServer/0'
    let master = 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/ArcGIS/rest/services/Stop_Reassessment_200207_view/FeatureServer/0'
    // returns only the ids that contain the stopid string that was inputed (WHERE STP_ID LIKE '%input%')
    let assessmentField = 'stopID'
    let masterField = 'STP_ID'
    return {
        assess: `${assessment}/query?where=cast%28${assessmentField}+as+varchar%2810%29%29+LIKE+%27%25${id}%25'&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=`,
        master: `${master}/query?where=cast%28${masterField}+as+varchar%2810%29%29+LIKE+%27%25${id}%25%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token`,
    }
}

const surveyData = () => 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/arcgis/rest/services/service_4fb5a9ba1c7a4e94b5c4428096fe5649/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=ccvu2nLcaM1UbsNZCAmrrqEx3e8hO3w8rVeckdXAKGPWzCRQYiJvVKyYzq0e98XbvIg6tWdKz81_-UC7sfCTl7-rbmB5RLhtYWDdOyqhTSbtni5Dxt9Z9kE18ZBPEdUKyCt14H9E21wJuZ-CFaFnlxjXp6hDPrujOaA_o7DZYZVgkET6WBB9H17T3wKCBc-uO64tFoK1UxvutKETIM4r8ywC8lX-aIzaHZ1altOGK7jF7bns-bIaDW3Md0LUSQzclxjF44qwk5soiZtN9twHjQ..'


const surveyID = () => {
    return {
        assess: '5e2cad9331d3458583bea6da5f19e488',
        dig: '',
    }
}


var clientId = 'FWyDUZ4S4EOaQjsi';
var redirectUri = 'https:///metrostl.arcgis.org';

// do this on a button click to avoid popup blockers


export { jsonURL, surveyID, surveyData, clientId, redirectUri }