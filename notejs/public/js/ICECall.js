let playerDiv = document.querySelector("div#playerDiv"),
    selfVideo = document.querySelector("video#selfVideo"),
    remoteVideo = document.querySelector("video#remoteVideo"),
    joinButton = document.querySelector("button#joinButton"),
    userName = document.querySelector("input#userName"),
    roomNumber = document.querySelector("input#roomNumber"),
    configuration = {
        iceServers: [{
            urls: ["stun:220.194.69.71:3478", "turn:220.194.69.71:3478"],
            username: "trun",
            credential: "trun",
            credentialType: "password"
        }]
    },
    offerOption = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceRestart: true
    }

var localStream, pc1, baseTopic = "mqtt/dome/conference/", id = randomWord(true, 8, 12), client

joinButton.onclick = join

function join() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log("浏览器不支持 mediaDevices 接口")
    } else {
        let constraints = {video: true, audio: false}
        navigator.mediaDevices.getUserMedia(constraints)
            .then(gotUserMediaStream)
            .catch(handleError)
    }
}

function gotUserMediaStream(stream) {
    selfVideo.srcObject = stream
    localStream = stream
    joinButton.disabled = true
    //join mqtt
    client = mqtt.connect('wss://v.goujinbo.com:61617')
    //mqtt 连接
    client.on("message", function (topic, payload) {
        console.log([topic, payload].join("::"));
        gotPayload(payload)
    })

    let joinMessage = {
        "type": "join",
        "userName": userName.value,
        "id": id,
        "roomNumber": roomNumber.value
    }
    console.log(baseTopic + "server/" + roomNumber.value)
    console.log(baseTopic + "server/" + roomNumber.value + "/" + id)
    client.publish(baseTopic + "page/" + roomNumber.value, JSON.stringify(joinMessage))
    client.subscribe([baseTopic + "server/" + roomNumber.value + "/" + id])


}

function gotPayload(payloadObject) {
    var payload = JSON.parse(payloadObject)
    if (payload.type === 'first') {

    } else if (payload.type === 'refuse') {
        //拒绝连接
    } else if (payload.type === 'second') {
        //第二个进入的，接收端
        //发offer
        //发起端，创建连接
        pc1 = new webkitRTCPeerConnection(configuration)//发送端
        pc1.onicecandidate = (e) => {
            // e.candidate.candidate;
            if (e.candidate) {
                //发送candidate 到接收端

                var data = {
                    "type": "candidate",
                    "data": e.candidate,
                    "id": id,
                    "roomNumber": roomNumber.value,
                    "index": 0 //发给第一个人
                }
                client.publish(baseTopic + "page/" + roomNumber.value, JSON.stringify(data))

            }

        }
        pc1.ontrack = getRemoteStream
        localStream.getTracks().forEach(t => {
            pc1.addTrack(t, localStream)
        })

        pc1.createOffer(offerOption).then(getOffer).catch(handleError)

    } else if (payload.type === 'offer') {

        //发启动发送的offer，应该是接收端去接
        //第一个人，接收端处理
        pc1 = new webkitRTCPeerConnection(configuration)//发送端
        pc1.onicecandidate = (e) => {
            // e.candidate.candidate;
            if (e.candidate) {
                //发送candidate 到接收端

                var data = {
                    "type": "candidate",
                    "data": e.candidate,
                    "id": id,
                    "roomNumber": roomNumber.value,
                    "index": 1 //发给第二个人
                }
                client.publish(baseTopic + "page/" + roomNumber.value, JSON.stringify(data))
            }
        }

        pc1.ontrack = getRemoteStream
        localStream.getTracks().forEach(t => {
            pc1.addTrack(t, localStream)
        })
        pc1.setRemoteDescription(payload).catch(handleError)
        pc1.createAnswer(offerOption).then(getAnswer).catch(handleError);
    } else if (payload.type === 'answer') {
        //接收端返回的answer 应该是发起端端去接
        console.log("answer---", payload)
        pc1.setRemoteDescription(payload).catch(handleError)
    } else if (payload.type === 'candidate') {
        console.log("candidate---")
        pc1.addIceCandidate(payload.data).catch(handleError)
    } else {
        console.log("error")
    }
}


function getOffer(desc) {
    pc1.setLocalDescription(desc)
    //把desc发给接收端
    var data = {
        "type": "offer",
        "data": desc,
        "id": id,
        "roomNumber": roomNumber.value
    }
    console.log(data)
    client.publish(baseTopic + "page/" + roomNumber.value, JSON.stringify(data))
}

function getAnswer(desc) {
    pc1.setLocalDescription(desc)
    // 发送desc到第一个端
    var data = {
        "type": "answer",
        "data": desc,
        "id": id,
        "roomNumber": roomNumber.value
    }
    console.log(data)
    client.publish(baseTopic + "page/" + roomNumber.value, JSON.stringify(data))
}


function getRemoteStream(d) {
    remoteVideo.srcObject = d.streams[0]
}


function handleError(err) {
    console.log("error:" + err.name + ":" + err.message)
}

function randomWord(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
            , 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'
            , 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'
            , 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D'
            , 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'
            , 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'
            , 'Y', 'Z']

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1))
        str += arr[pos]
    }
    return str
}