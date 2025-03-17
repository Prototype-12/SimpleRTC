class Connection {
  cfg = {iceServers: [{url: "stun:stun.gmx.net"}]}
  con = {optional: [{DtlsSrtpKeyAgreement: true}]}
  sdpConstraints = {optional: []}

  constructor(onMessageCallbackFn, onOpenCallbackFn) {
    this.onMessageCallbackFn = onMessageCallbackFn
    this.onOpenCallbackFn = onOpenCallbackFn
  }

  localOffer(callbackFn) {
    this.pc1 = new RTCPeerConnection(this.cfg, this.con)
    let dc1 = this.pc1.createDataChannel('chat'+Math.random(), {reliable: true})
    this.dc1 = dc1
    dc1.onopen = this.onOpenCallbackFn//function(e){console.log("dc1 onopen", e)}
    dc1.onmessage = this.onMessageCallbackFn
    this.pc1.createOffer((desc)=>{this.pc1.setLocalDescription(desc, function(){}, function(){})}, function(){}, this.sdpConstraints)
    this.pc1.onicecandidate = (e)=>{
      if (e.candidate == null) {// send local offer
        callbackFn(JSON.stringify(this.pc1.localDescription))
      }
    }
  }

  reciveAnswer(ans) {
    this.pc1.setRemoteDescription(new RTCSessionDescription(JSON.parse(ans)));
  }

  reciveOffer(offer, callbackFn) {
    this.pc2 = new RTCPeerConnection(this.cfg, this.con)
    var offerDesc = new RTCSessionDescription(JSON.parse(offer))
    this.pc2.setRemoteDescription(offerDesc)
    this.pc2.createAnswer((answerDesc)=>{this.pc2.setLocalDescription(answerDesc)}, function(){}, this.sdpConstraints)
    this.pc2.ondatachannel = (e)=>{
      let dc2 = e.channel
      this.dc2 = dc2
      dc2.onopen = this.onOpenCallbackFn//function(e){console.log("dc2 onopen", e)}
      dc2.onmessage = this.onMessageCallbackFn
    }
    this.pc2.onicecandidate = (e)=>{
      if (e.candidate == null) {//send local answer
        callbackFn(JSON.stringify(this.pc2.localDescription))
      }
    }
  }

  sendMessage(msg) {
    this.dc1?.send(msg)
    this.dc2?.send(msg)
  }
}