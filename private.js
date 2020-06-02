const jsonURL = (id) => {
    let assessment = 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/ArcGIS/rest/services/Contractor_Install_Survey_Copy_view/FeatureServer/0'
    let master = 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/ArcGIS/rest/services/Stop_Reassessment_200207_view/FeatureServer/0'
    // returns only the ids that contain the stopid string that was inputed (WHERE STP_ID LIKE '%input%')
    let assessmentField = 'stopID'
    let masterField = 'STP_ID'
    return {
        assess: `${assessment}/query?where=cast%28${assessmentField}+as+varchar%2810%29%29+LIKE+%27%25${id}%25'&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=`,
        master: `${master}/query?where=cast%28${masterField}+as+varchar%2810%29%29+LIKE+%27%25${id}%25%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token`,
    }
}

const surveyData = () => 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/ArcGIS/rest/services/Contractor_Install_Survey_Copy_view/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=pyEcn9_-FVKVC9Ut22I2cXOgJF68ktmpW-ewoGzeoZtPWJhQMJLOhvkqqcSz9xOOxWYi4EoecgofXQTzvL98RGBI8bp4cJ6fFdEr6j8J955LMDRsqZh0TiRD8JoKg-un1i9TcU1aeplJ-172j_C6isiRyj5NKAF06emgS8PelVswBo3ipFRAlL1pu6WJVZ-8APaz5b5x9zMV4Gw3PlRFNeR8hDJiPoD03PF-zCJhGm9bco71698GDAuAQ3fPAU-PEcPSwWa7SB96dH50PAeiUg..'


const surveyID = () => {
    return '5c6d730d7c354661a3038b0eff0ad19d'
}

export { jsonURL, surveyID, surveyData }