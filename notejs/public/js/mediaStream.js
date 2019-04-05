let audioInput = document.querySelector("select#audioInput")
    , audioOutput = document.querySelector("select#audioOutput")
    , videoInput = document.querySelector("select#videoInput")
    , videoPlayer = document.querySelector("video#player")
    , filterSelect = document.querySelector("select#filter")
    , snapshot = document.querySelector("button#snapshot")
    , picture = document.querySelector("canvas#picture")
    , constraints = document.querySelector("pre#constraints")
    , recPlayer = document.querySelector("video#recPlayer")
    , recordButton = document.querySelector("button#recordButton")
    , recPlayerButton = document.querySelector("button#recPlayerButton")
    , downloadRec = document.querySelector("button#downloadRec")
var selectOver = false, buffer, mediaRecorder

picture.width = 640;
picture.height = 480;

function start() {
    let videoInputDeviceId = videoInput.value
    let constraints = {
        video: {
            frameRate: 30,
            deviceId: videoInputDeviceId ? {exact: videoInputDeviceId} : undefined
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
    window.stream = stream
    var videoTrack = stream.getVideoTracks()[0];
    var videoConstraints = videoTrack.getSettings();
    constraints.textContent = JSON.stringify(videoConstraints, null, 4);
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
snapshot.onclick = function () {
    picture.getContext('2d').drawImage(videoPlayer
        , 0, 0
        , picture.width, picture.height
    )
    ;
}

recordButton.onclick = () => {
    if (recordButton.textContent === '开始录制') {
        startRecord();
        recordButton.textContent = '停止录制'
        recPlayerButton.disabled = true
        downloadRec.disabled = true
    } else {
        stopRecord();
        recordButton.textContent = '开始录制'
        recPlayerButton.disabled = false
        downloadRec.disabled = false
    }
}


function startRecord() {
    buffer = []
    var options = {
        mimeType: 'video/webm'
    }
    if (!MediaRecorder.isTypeSupported(options.mimeType)
    ) {
        console.error('${options.mimeType} is not supported!!')
        return
    }
    try {
        mediaRecorder = new MediaRecorder(window.stream, options)

    } catch (e) {
        console.error("Failed to create Mediarecorder : ", e)
        return
    }
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10)
}

function handleDataAvailable(e) {
    if (e && e.data && e.data.size > 0) {
        buffer.push(e.data)
    }
}

function stopRecord() {
    mediaRecorder.stop()
}

recPlayerButton.onclick = () => {
    var blob = new blob(buffer, {type: "video/webm"})
    recPlayer.src = window.URL.createObjectURL(blob)
    recPlayer.srcObject = null
    recPlayer.controls = true
    recPlayer.play()
}