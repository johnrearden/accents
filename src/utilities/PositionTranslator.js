const LONGITUDE_RATIO = 266;
const LATITUDE_RATIO = 438;
const REFERENCE_POINT = {
    long : -7.9419,
    lat : 53.4329,
    xPos : 741,
    yPos : 911,
    county : 'westmeath'
}

export const calculateYPos = (lat) => {
    let deltaLat = lat - REFERENCE_POINT.lat;
    let deltaPix = parseInt(deltaLat * LATITUDE_RATIO);
    return REFERENCE_POINT.yPos - deltaPix;
}

export const calculateXPos = (long) => {
    let deltaLong = long - REFERENCE_POINT.long;
    let deltaPix = parseInt(deltaLong * LONGITUDE_RATIO);
    return REFERENCE_POINT.xPos + deltaPix;
}



