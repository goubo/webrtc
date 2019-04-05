if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia()) {
    console.log("浏览器不支持 mediaDevices 接口")
} else {
    var constraints = {
        video: {
            frameRate: 30
        },
        audio: {
            noiseSuppression: true
        }
    }
    navigator.mediaDevices.getUserMedia(constraints)
        .then(gotUserMedieStream)
        .then(getMediaDevices)
        .catch(handleError);
}
var audioInput = document.querySelector("select#audioInput")
    , audioOutput = document.querySelector("select#audioOutput")
    , videoInput = document.querySelector("select#videoInput")

var videoPlayer = document.querySelector("video#player")

function handleError(err) {
    console.log("error:" + err.name + ":" + err.message)
}

function gotUserMedieStream(stream) {
    videoPlayer.srcObject = stream
    return navigator.mediaDevices.enumerateDevices()
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