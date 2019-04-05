let videoPlayer = document.querySelector("video#player")
    , filterSelect = document.querySelector("select#filter")
    , snapshot = document.querySelector("button#snapshot")
    , picture = document.querySelector("canvas#picture")
    , constraints = document.querySelector("pre#constraints")
    , recPlayer = document.querySelector("video#recPlayer")
    , recordButton = document.querySelector("button#recordButton")
    , recPlayerButton = document.querySelector("button#recPlayerButton")
    , downloadRec = document.querySelector("button#downloadRec")
var buffer, mediaRecorder


function start() {
    let constraints = {
        video: true,
        audio: false
    }
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia()) {
        console.log("浏览器不支持 mediaDevices 接口")
    } else {
        navigator.mediaDevices.getDisplayMedia(constraints)
            .then(gotDisplayMedieStream)

            .catch(handleError)
    }
}


function handleError(err) {
    console.log("error:" + err.name + ":" + err.message)
}

function gotDisplayMedieStream(stream) {
    videoPlayer.srcObject = stream
    window.stream = stream
    var videoTrack = stream.getVideoTracks()[0]
    var videoConstraints = videoTrack.getSettings()
    constraints.textContent = JSON.stringify(videoConstraints, null, 4)
    return navigator.mediaDevices.enumerateDevices()
}


start()

filterSelect.onchange = function () {
    videoPlayer.className = filterSelect.value
}
snapshot.onclick = function () {
    picture.getContext('2d').drawImage(videoPlayer
        , 0, 0
        , picture.width, picture.height
    )
}

recordButton.onclick = () => {
    if (recordButton.textContent === '开始录制') {
        startRecord()
        recordButton.textContent = '停止录制'
        recPlayerButton.disabled = true
        downloadRec.disabled = true
    } else {
        stopRecord()
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
    mediaRecorder.ondataavailable = handleDataAvailable
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
    var blob = new Blob(buffer, {type: "video/webm"})
    recPlayer.src = window.URL.createObjectURL(blob)
    recPlayer.srcObject = null
    recPlayer.controls = true
    recPlayer.play()
}

downloadRec.onclick = () => {
    var blob = new Blob(buffer, {type: "video/webm"})
    var url = window.URL.createObjectURL(blob)
    var a = document.createElement("a")
    a.href = url
    a.style.display = 'none'
    a.download = "aaa.webm"
    a.click()
}