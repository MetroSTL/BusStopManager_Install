let assessment = 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/ArcGIS/rest/services/service_834b037efc2b4f58a2e6ca08298d8686/FeatureServer/0'
let master = 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/ArcGIS/rest/services/Stop_Reassessment_200207_view/FeatureServer/0'
let dig = 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/ArcGIS/rest/services/service_7a70150209ac48488446b15da0583857/FeatureServer/0'



const jsonURL = (id, token) => {
    // returns only the ids that contain the stopid string that was inputed (WHERE STP_ID LIKE '%input%')
    let assessmentField = 'stopID';
    let masterField = 'STP_ID';
    console.log('token: ', token);
    return {
        assess: `${assessment}/query?where=cast%28${assessmentField}+as+varchar%2810%29%29+LIKE+%27%25${id}%25'&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=${token}`,
        master: `${master}/query?where=cast%28${masterField}+as+varchar%2810%29%29+LIKE+%27%25${id}%25%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=${token}`,
    }
};

const surveyData = (token) => {
    console.log('token: ', token);
    return {
        assess: `${assessment}/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=& spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=${token}`,
        dig: `${dig}/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=${token}`


    }
};
const surveyID = () => {
    return {
        assess: '5e2cad9331d3458583bea6da5f19e488',
        dig: '62060dec722640ae97ac2c5653950429',
    }
}


var clientId = 'hhibAhdSLrpXfARP';
var redirectUri = 'http://127.0.0.1:8080/';
// var redirectUri = 'https://testexternalapps.metrostlouis.org/busstopassessment/';

// do this on a button click to avoid popup blockers


// requests log
// https://itic.occinc.com/wsexternal/service/getticketstatus/BiStateDevelopment/W3lc0me!/MO/1
export { jsonURL, surveyID, surveyData, clientId, redirectUri }
