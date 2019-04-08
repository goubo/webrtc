let localVideo = document.querySelector("video#localVideo")
    , remoteVideo = document.querySelector("video#remoteVideo")
    , hangupButton = document.querySelector("button#hangup")
    , callButton = document.querySelector("button#call")
    , startButton = document.querySelector("button#start")

var localStream

startButton.onclick = start
callButton.onclick = call
hangupButton.onclick = hangup
callButton.disable = true
hangupButton.disable = true

function start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log("浏览器不支持 mediaDevices 接口")
    } else {
        let constraints = {video: true, audio: false}
        navigator.mediaDevices.getUserMedia(constraints)
            .then(gotUserMediaStream)
            // .then(getMediaDevices)
            .catch(handleError)
    }
}

function hangup() {
}

function call() {

}

function gotUserMediaStream() {
    localVideo.srcObject = stream
    localStream = stream
}


function handleError(err) {
    console.log("error:" + err.name + ":" + err.message)
}