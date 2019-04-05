if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices()) {
    console.log("浏览器不支持 mediaDevices 接口")
} else {
    navigator.mediaDevices.enumerateDevices()
        .then(getMediaDevices)
        .catch(handleError);
}

var audioInput = document.querySelector("select#audioInput")
    , audioOutput = document.querySelector("select#audioOutput")
    , videoInput = document.querySelector("select#videoInput")


function handleError(err) {
    console.log("error:" + err.name + ":" + err.message)
}

function getMediaDevices(devicesInfos) {
    devicesInfos.forEach(function (devicesInfo) {
        console.log("kind=" + devicesInfo.kind +
            ";label=" + devicesInfo.label +
            ";id=" + devicesInfo.deviceId +
            ";groupId:" + devicesInfo.groupId)
        var option = document.createElement("option")
        option.text = devicesInfo.label
        option.value = devicesInfo.deviceId
        if (devicesInfo.kind === 'audioinput') {
            audioInput.appendChild(option)
        } else if (devicesInfo.kind === 'audiooutput') {
            audioOutput.appendChild(option)
        } else if (devicesInfo.kind === 'videoinput') {
            videoInput.appendChild(option)

        }
    })

}

