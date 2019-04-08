let localVideo = document.querySelector("video#localVideo")
    , remoteVideo = document.querySelector("video#remoteVideo")
    , hangupButton = document.querySelector("button#hangup")
    , callButton = document.querySelector("button#call")
    , startButton = document.querySelector("button#start")

var localStream

startButton.onclick = start
callButton.onclick = call
hangupButton.onclick = hangup


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
    pc1 = new webkitRTCPeerConnection()//发送端
    pc2 = new webkitRTCPeerConnection()//接收端

    pc1.onicecandidate = (e) => {
        pc2.addIceCandidate(e.candidate).catch(handleError)
    }

    pc2.onicecandidate = (e) => {
        pc1.addIceCandidate(e.candidate).catch(handleError)
    }
    pc2.ontrack = getRemoteStream

    localStream.getTracks().forEach(t => {
        pc1.addTrack(t)
    })
    let offerOption = {
        offerToReceiveAudio: 0,
        offerToReceiveVideo: 1
    }
    pc1.createOffer(offerOption).then(getOffer).catch(handleError)

}

function getAnswer(desc) {
    pc2.setLocalDescription(desc).catch(handleError)
    //发送desc到信令
    //发给对方
    //下面是第一方收到的信令
    pc1.setRemoteDescription(desc).catch(handleError)
}

function getOffer(desc) {
    pc1.setLocalDescription(desc).catch(handleError)
    // 发送 desc 到信令服务器
    // 发给对方
    // 下面是第二方收到后
    pc2.setRemoteDescription(desc).catch(handleError)
    pc2.createAnswer().then(getAnswer).catch(handleError)
}

function getRemoteStream(d) {
    remoteVideo.srcObject = d.streams[0]
}

function gotUserMediaStream(stream) {
    localVideo.srcObject = stream
    localStream = stream
}


function handleError(err) {
    console.log("error:" + err.name + ":" + err.message)
}