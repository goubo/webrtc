let audioInput = document.querySelector("select#audioInput")
    , audioOutput = document.querySelector("select#audioOutput")
    , videoInput = document.querySelector("select#videoInput")
    , videoPlayer = document.querySelector("video#player")
    , filterSelect = document.querySelector("select#filter")
var selectOver = false

function start() {
    let videoInputDeviceId = videoInput.value
    let constraints = {
        video: {
            frameRate: 30,
            deviceId: videoInputDeviceId ? videoInputDeviceId : undefined
        },
        audio: {
            noiseSuppression: true
        }

    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia(constraints)) {
        console.log("浏览器不支持 mediaDevices 接口")
    } else {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(gotUserMedieStream)
            .then(getMediaDevices)
            .catch(handleError);
    }
}


function handleError(err) {
    console.log("error:" + err.name + ":" + err.message)
}

function gotUserMedieStream(stream) {
    videoPlayer.srcObject = stream
    return navigator.mediaDevices.enumerateDevices()
}


function getMediaDevices(devicesInfos) {
    if (selectOver) return
    selectOver = true
    devicesInfos.forEach(function (devicesInfo) {
        console.log("kind=" + devicesInfo.kind +
            ";label=" + devicesInfo.label +
            ";deviceId=" + devicesInfo.deviceId +
            ";groupId:" + devicesInfo.groupId)
        let option = document.createElement("option")
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

start();

videoInput.onchange = start;

filterSelect.onchange = function () {
    videoPlayer.className = filterSelect.value
}