const jsonURL = (id) => {
    let service = 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/ArcGIS/rest/services/Stop_Reassessment_200207_view/FeatureServer/0'
    
    // returns only the ids that contain the stopid string that was inputed (WHERE STP_ID LIKE '%input%')
    return  `${service}/query?where=cast%28STP_ID+as+varchar%2810%29%29+LIKE+%27%25${id}%25%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=iLw5_zNF2-ivmuHYXRdBqwqhGbt_aAgz4CXTk_pdDoK5Fh02yf-nSOjajkb-S4xmDEARmB9tjfdkEEJSyQeazSz3AnYo5LvE8bjSpkwqE1-f4h5T4XaURlxk6GD83uwYe6-YiuY_QvicGtHQ0Rb2HValhPLrAFN8-MksjifIWdJk71Urm0tTPwegq50LrXU8yD1Tm4pgXLsnal1vxrPw-ql1UQVKiHhL7CVbz0sYxUo2nxn5is0WEwF1UNzfg-86tfszIuuTWgXPIMr4oRcYFw..`
}

const surveyID = () => {
    return '70845cc533764f7ea2a93ea00699d5ad'
}

export { jsonURL, surveyID }