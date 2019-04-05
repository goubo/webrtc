if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices()) {
    console.log("浏览器不支持 mediaDevices 接口")
} else {
    navigator.mediaDevices.enumerateDevices()
        .then()
        .catch(handleError);
}

function handleError(err) {
    console.log("error:" + err.name + ":" + err.message())
}

function getMediaDevices(devicesInfos){
    devicesInfos.forEach(function (devicesInfo) {
        console.log("kind="+devicesInfo.kind+";lable="+devicesInfo.label+";id="+devicesInfo.id+";groupId:"+devicesInfo.groupId)
        })
}