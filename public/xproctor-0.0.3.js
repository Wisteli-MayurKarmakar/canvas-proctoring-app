
ExamdAutoProctorJS = {
  /*
        This library is used for adding Auto Proctoring support to 3rd party applications.
        It needs JQuery as a dependency
    */

  version: null,
  curr_version: null,
  auth_url: null,
  policy_url: null,
  rules_url: null,
  media_url: null,
  update_url: "https://examd.us/cdn/urls/xproctor/1",
  htvdofeed_url: null,
  socketEp: null,

  /* Session Variables */
  authUser: "none",
  authPass: "none",
  fullResponse: null,
  authToken: null,
  basicAuthToken: "Basic TIxApZe7MCosW6:pU1URzjGkY8QVC",
  expireTime: null,
  libraryInited: false,
  randomExamId: null,

  /* Video */
  xvideo: null,
  xcanvas: null,
  ctxcnvs: null,
  vstream: null,
  sstream: null,
  vdoextn: null,
  scrextn: null,
  recording: false,

  capVdoRqst: false,
  capAudRqst: false,
  capScrRqst: false,

  /* Socket */
  xsock: null,
  sockConnected: false,

  /* AI process init, end  APIs*/
  aiProcessInitURL: "https://examd.online/ai/frame/init",
  aiImgPostURL: "https://examd.online/ai/frame/process",
  aiProcessEndURL: "https://examd.online/ai/frame/fin",

  frame: 0,

  initAIProcess: function (id, callback) {
    console.log("initAIProcess", ExamdAutoProctorJS.basicAuthToken)
    const formData = new FormData();
    formData.append("name", id);
    $.ajax({
      url: ExamdAutoProctorJS.aiProcessInitURL,
      type: "POST",
      data: formData,
      headers: {
        Authorization: ExamdAutoProctorJS.basicAuthToken
      },
      onSuccess: function (data) {
        console.log(data);
      }
    })
  },

  sendImageToAI: function (id, images) {
    const formData = new FormData();
    formData.append("name", id);
    ExamdAutoProctorJS.frame += 1;
    formData.append("frame", ExamdAutoProctorJS.frame);
    formData.append("image", images);
    $.ajax({
      url: ExamdAutoProctorJS.aiImgPostURL,
      type: "POST",
      data: formData,
      headers: {
        // Authorization: ExamdAutoProctorJS.basicAuthToken
        Authorization: "Basic VEl4QXBaZTdNQ29zVzY6cFUxVVJ6akdrWThRVkM="
      },
      onSuccess: function (data) {
        console.log(data);
      }
    })
  },

  endAIProcess: function (id, callback) {
    const formData = new FormData();
    formData.append("name", id);
    formData.append("fps", 1);
    formData.append("vdotype", "V");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        callback(xhr.response);
      }
    }
    xhr.open("POST", this.aiProcessEndURL, formData);
    xhr.setRequestHeader("Authorization", ExamdAutoProctorJS.basicAuthToken);
    xhr.send();
  },

  callback: function (data) {
    console.log(data);
  },

  /*
        Library Inited
    */
  initLibrary: async function () {
    if (ExamdAutoProctorJS.checkJquery() && ExamdAutoProctorJS.checkSockIO()) {
      // Generate Random Exam ID
      ExamdAutoProctorJS.randomExamId = crypto.randomUUID();

      // Get the URLs
      var result = await $.ajax({
        type: "GET",
        url: ExamdAutoProctorJS.update_url,
      });

      if (result.name === "xproctor") {
        ExamdAutoProctorJS.version = result.version;
        ExamdAutoProctorJS.curr_version = result.curr_version;
        ExamdAutoProctorJS.auth_url = result.auth_url;
        ExamdAutoProctorJS.policy_url = result.policy_url;
        ExamdAutoProctorJS.rules_url = result.rules_url;
        (ExamdAutoProctorJS.htvdofeed_url = result.htvdoinit_url),
          (ExamdAutoProctorJS.socketEp = result.socketEp),
          (ExamdAutoProctorJS.media_url = result.media_url),
          // Now add a video and a canvas component
          (xvideo = $("<video />", {
            id: "xvideo",
            type: "video/webm",
            controls: true,
            width: "480",
            height: "320",
            muted: "muted",
          }));

        xcanvas = $("<canvas />", {
          id: "xcanvas",
          width: "480",
          height: "320",
        });

        ExamdAutoProctorJS.xsock = await ExamdAutoProctorJS.initSocket();
        ExamdAutoProctorJS.libraryInited = true;
      }

      return {
        status: 0,
        jqueryCheck: true,
        socketioCheck: true,
        socketId: ExamdAutoProctorJS.xsock.id,
        assignedId: ExamdAutoProctorJS.randomExamId,
      };
    }

    return {
      status: 1,
      jqueryCheck: ExamdAutoProctorJS.checkJquery(),
      socketioCheck: ExamdAutoProctorJS.checkSockIO(),
    };
  },

  /*
        Init Socket functions
    */
  initSocket: async function () {
    const sockt = await io(ExamdAutoProctorJS.socketEp, {
      reconnectionDelayMax: 10000,
    });
    sockt.on("connect", () => {
      ExamdAutoProctorJS.sockConnected = true;
    });
    sockt.on("disconnect", () => {
      ExamdAutoProctorJS.sockConnected = false;
    });

    return sockt;
  },

  /*
        Is JQuery available?
    */
  checkJquery: function () {
    return !(typeof jQuery === "undefined");
  },

  /*
        Is Socket.io available?
    */
  checkSockIO: function () {
    return !(typeof io === "undefined");
  },

  /*
        Return version
    */
  getVersion: function () {
    return ExamdAutoProctorJS.version;
  },

  setCredentials: function (usr, pwd) {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    ExamdAutoProctorJS.authUser = usr;
    ExamdAutoProctorJS.authPass = pwd;
  },

  /*
        Authenticate and return a Json token
    */
  doAuth: function (onSuccessCallback, onFailureCallback) {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    if (
      ExamdAutoProctorJS.expireTime === null ||
      ExamdAutoProctorJS.expireTime <= new Date()
    ) {
      var data =
        "username=" +
        ExamdAutoProctorJS.authUser +
        "&password=" +
        ExamdAutoProctorJS.authPass;
      $.ajax({
        type: "POST",
        url: ExamdAutoProctorJS.auth_url,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        data: data,
        success: function (response) {
          ExamdAutoProctorJS.fullResponse = response;
          var splitToken = JSON.parse(
            atob(response.access_token.split(".")[1])
          );
          var expire = new Date(splitToken.exp * 1000);
          ExamdAutoProctorJS.authToken = "Bearer " + response.access_token;
          ExamdAutoProctorJS.expireTime = expire;
          if (onSuccessCallback !== undefined) {
            onSuccessCallback(response);
          }
        },
        error: function (jqXHR, textStatus, error) {
          if (onFailureCallback !== undefined) {
            onFailureCallback(jqXHR, textStatus, error);
          }
        },
      });
    } else {
      if (onSuccessCallback !== undefined) {
        onSuccessCallback(ExamdAutoProctorJS.fullResponse);
      }
    }
  },

  /*
        This method is a override to return a Promise
    */
  doAuthSync: function () {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    return new Promise((resolve, reject) => {
      ExamdAutoProctorJS.doAuth(
        (successResponse) => {
          resolve(successResponse);
        },
        (errorResponse) => {
          reject(errorResponse);
        }
      );
    });
  },

  /*
        Return a list of Devices
    */
  getDevices: function (cback) {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      var devList = [];
      // Get user permission
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(() => navigator.mediaDevices.enumerateDevices())
        .then((device) => {
          $.each(device, function (index, dv) {
            const thisNode = {
              name: dv.label,
              deviceId: dv.deviceId,
              groupId: dv.groupId,
            };
            if (!devList[dv.kind]) {
              var newArr = new Array();
              newArr.push(thisNode);
              devList[dv.kind] = newArr;
            } else {
              devList[dv.kind].push(thisNode);
            }
          });

          cback(devList);
        });
    } else {
      return null;
    }
  },

  /*
        Return a list of Devices as Promise
    */
  getDevicesSync: function () {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    return new Promise((resolve, reject) => {
      ExamdAutoProctorJS.getDevices((successResponse) => {
        resolve(successResponse);
      });
    });
  },

  /*
        Verify Audio/ Video defaults
        Return AudioInput, AudioOutput and VideoInput
    */
  getDefaultAudioVideo: function (cback) {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    ExamdAutoProctorJS.getDevices(function (dvc) {
      if (dvc == null) {
        cback({
          status: 1,
          audioInFound: false,
          audioOutFound: false,
          videoInFound: false,
          audioInDevice: null,
          audioOutDevice: null,
          videoInDevice: null,
        });
      }
      var dfltAudioIn = null;
      var dfltAudioOut = null;
      var dfltVideoIn = null;
      $.each(dvc["audioinput"], function (index, dv) {
        if (dfltAudioIn === null) {
          dfltAudioIn = dv;
        } else if (dv.deviceId === "default") {
          dfltAudioIn = dv;
        }
      });
      $.each(dvc["audiooutput"], function (index, dv) {
        if (dfltAudioOut === null) {
          dfltAudioOut = dv;
        } else if (dv.deviceId === "default") {
          dfltAudioOut = dv;
        }
      });
      $.each(dvc["videoinput"], function (index, dv) {
        if (dfltVideoIn === null) {
          dfltVideoIn = dv;
        } else if (dv.deviceId === "default") {
          dfltVideoIn = dv;
        }
      });
      cback({
        status: 0,
        audioInFound: dfltAudioIn !== null,
        audioOutFound: dfltAudioOut !== null,
        videoInFound: dfltVideoIn !== null,
        audioInDevice: dfltAudioIn,
        audioOutDevice: dfltAudioOut,
        videoInDevice: dfltVideoIn,
      });
    });
  },

  /*
        Get Supported Media type
    */
  getSupportedMediaMime: function () {
    var options, extn;
    if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
      options = { mimeType: "video/webm; codecs=vp9" };
      extn = "webm";
    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
      options = { mimeType: "video/webm; codecs=vp8" };
      extn = "webm";
    } else {
      options = { mimeType: "video/mp4" };
      extn = "mp4";
    }

    return {
      options: options,
      extn: extn,
    };
  },

  /*
        Verify Audio/ Video defaults
        Return AudioInput, AudioOutput and VideoInput as Promise
    */
  getDefaultAudioVideoSync: function () {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    return new Promise((resolve, reject) => {
      ExamdAutoProctorJS.getDefaultAudioVideo((successResponse) => {
        resolve(successResponse);
      });
    });
  },

  /*
        Browser Check
        We support Chrome and Edge only with version 
    */
  browserSupport: function () {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    var agent = navigator.userAgent;
    var name, version, major, versTag;
    name = versTag = "none";
    version = "0.0";
    // Edge
    if ((versTag = agent.lastIndexOf("Edg/")) != -1) {
      name = "Edge";
      version = agent.substring(versTag + 4);
    }
    // Internet Explorer
    else if ((versTag = agent.lastIndexOf("MSIE")) != -1) {
      name = "MS Internet Explorer";
      version = agent.substring(versTag + 5);
    }
    // Firefox
    else if ((versTag = agent.lastIndexOf("Firefox")) != -1) {
      name = "Firefox";
      version = agent.substring(versTag + 8);
    }
    // Chrome
    else if ((versTag = agent.indexOf("Chrome")) != -1) {
      name = "Chrome";
      version = agent.substring(versTag + 7);
    }
    // Safari
    else if ((versTag = agent.lastIndexOf("Safari")) != -1) {
      name = "Safari";
      version = agent.substring(versTag + 7);
      if ((versTag = agent.lastIndexOf("Version")) != -1) {
        version = agent.substring(versTag + 8);
      }
    }

    // Extract Major version
    major = parseInt(version.substring(0, version.indexOf(".")));
    if ((name === "Chrome" && major > 95) || (name === "Edge" && major > 96)) {
      return true;
    }

    return false;
  },

  /*
        Location Bandwidth check
    */
  bandwidthCheck: function () {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    // 6 MBPS
    if (navigator.connection) {
      if (navigator.connection.downlink >= 4) {
        return true;
      }
    } else {
      // Not available for Firefox, just pass through
      return true;
    }

    return false;
  },

  /*
        Get Privacy Policy
    */
  getPrivacyPolicy: async function (instituteId) {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    const token = await ExamdAutoProctorJS.doAuthSync();
    const auth_tkn = token.token_type + " " + token.access_token;
    const pol_url = ExamdAutoProctorJS.policy_url.replace("{ID}", instituteId);

    try {
      var result = await $.ajax({
        type: "GET",
        url: pol_url,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", auth_tkn);
        },
      });

      return {
        status: 0,
        msg: result,
      };
    } catch (error) {
      return {
        status: 1,
        msg: error,
      };
    }
  },

  /*
        Get Exam Rules
    */
  getExamRules: async function (instituteId) {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    const token = await ExamdAutoProctorJS.doAuthSync();
    const auth_tkn = token.token_type + " " + token.access_token;
    const pol_url = ExamdAutoProctorJS.rules_url.replace("{ID}", instituteId);

    try {
      var result = await $.ajax({
        type: "GET",
        url: pol_url,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", auth_tkn);
        },
      });

      return {
        status: 0,
        msg: result,
      };
    } catch (error) {
      return {
        status: 1,
        msg: error,
      };
    }
  },

  /*
        Open Media Channels
    */
  openChannels: async function (
    capVdo,
    capAdo,
    capScr,
    showVdo,
    excpCallback,
    logCallback
  ) {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    if ($("#xmedia").length) {
      xvideo.appendTo($("#xmedia"));
      xcanvas.appendTo($("#xmedia"));
      if (!showVdo) xvideo.css("display", "none");
      if (!showVdo) xcanvas.css("display", "none");
    } else {
      console.error("Error: No xmedia div");
      return {
        status: 1,
        msg: "Please add a div named xmedia in code...",
      };
    }

    var medias = await ExamdAutoProctorJS.getDefaultAudioVideoSync();
    if (medias.status === 0) {
      // Is media available
      if (capVdo && !medias.videoInFound) {
        return {
          status: 1,
          msg: "Video requested, but no corresponding device",
        };
      }
      if (capAdo && !medias.audioInFound) {
        return {
          status: 1,
          msg: "Audio requested, but no corresponding device",
        };
      }

      // Set On Message for Socket
      ExamdAutoProctorJS.xsock.on("message", (txt) => {
        if (excpCallback) excpCallback(txt);
      });
      ExamdAutoProctorJS.xsock.on("screen", (txt) => {
        if (logCallback) logCallback(txt);
      });

      // Now let's start media
      var optExtn = ExamdAutoProctorJS.getSupportedMediaMime();
      if (capVdo || capAdo) {
        try {
          var options = optExtn.options;
          ExamdAutoProctorJS.vdoextn = optExtn.extn;
          var constraints = {
            video: capVdo,
            audio: capAdo,
            mimeType: options.mimeType,
          };

          var adoVdo = await navigator.mediaDevices.getUserMedia(constraints);
          ExamdAutoProctorJS.vstream = adoVdo;

          // Let's add this to video stream
          var video = $("#xvideo")[0];
          video.srcObject = adoVdo;
          video.load();
          video.play();
          ExamdAutoProctorJS.recording = true;

          // Get Video context
          var canvas = $("#xcanvas")[0];
          var last = 0;
          var ctxcnvs = canvas.getContext("2d");
          ExamdAutoProctorJS.initAIProcess(ExamdAutoProctorJS.randomExamId, ExamdAutoProctorJS.callback);
          video.addEventListener("play", () => {
            function step(now) {
              if (!last || now - last >= 1 * 1000) {
                last = now;
                ctxcnvs.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Send image and check for Student violations here
                var jsn = {
                  evt: "detect",
                  payload: {
                    filename: "tempfile.png",
                  },
                };
                var dataUrl = canvas.toDataURL("image/png");
                var blobdata = ExamdAutoProctorJS.convertDataUrl2Blob(dataUrl);
                jsn.file = blobdata;
                ExamdAutoProctorJS.sendImageToAI(jsn);
                // ExamdAutoProctorJS.xsock.emit("scene", jsn);
              }

              if (ExamdAutoProctorJS.recording) {
                requestAnimationFrame(step);
              }
            }
            requestAnimationFrame(step);
          });
        } catch (err) {
          console.error("Error: " + err);
          return {
            status: 1,
            msg: "Permission denied",
          };
        }
      }

      if (capScr) {
        try {
          var options = optExtn.options;
          ExamdAutoProctorJS.scrextn = optExtn.extn;
          var constraints = {
            video: capScr,
            audio: false,
            mimeType: options.mimeType,
          };

          var scrStm = await navigator.mediaDevices.getDisplayMedia(
            constraints
          );
          ExamdAutoProctorJS.sstream = scrStm;
        } catch (err) {
          console.error("Error: " + err);
          return {
            status: 1,
            msg: "Permission denied",
          };
        }
      }

      ExamdAutoProctorJS.capVdoRqst = capVdo;
      ExamdAutoProctorJS.capAudRqst = capAdo;
      ExamdAutoProctorJS.capScrRqst = capScr;

      return {
        status: 0,
        msg: "Channels opened",
      };
    } else {
      return {
        status: 1,
        msg: "Cannot retrieve default devices",
      };
    }
  },

  /*
        Start recording Video
    */
  startVideoRecording: function () {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    if (!ExamdAutoProctorJS.vstream) return null;
    var mrecorder = new MediaRecorder(ExamdAutoProctorJS.vstream);
    mrecorder.ondataavailable = function (e) {
      ExamdAutoProctorJS.sendVideoFeed(e.data);
    };
    mrecorder.start(5000);
    ExamdAutoProctorJS.recording = true;
  },

  /*
        Start recording Screen
    */
  startScreenRecording: function () {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    if (!ExamdAutoProctorJS.sstream) return null;
    var mrecorder = new MediaRecorder(ExamdAutoProctorJS.sstream);
    mrecorder.ondataavailable = function (e) {
      ExamdAutoProctorJS.sendScreenFeed(e.data);
    };
    mrecorder.start(5000);
  },

  /*
        Start recording
    */
  startRecording: function () {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    if (!ExamdAutoProctorJS.sstream) return null;

    if (ExamdAutoProctorJS.capVdoRqst || ExamdAutoProctorJS.capAudRqst) {
      ExamdAutoProctorJS.startVideoRecording();
    }

    if (ExamdAutoProctorJS.capScrRqst) {
      ExamdAutoProctorJS.startScreenRecording();
    }
  },

  /*
        Remove Channels
    */
  stopRecording: function () {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    ExamdAutoProctorJS.endAIProcess(ExamdAutoProctorJS.randomExamId, ExamdAutoProctorJS.callback);
    if (ExamdAutoProctorJS.vstream) {
      ExamdAutoProctorJS.vstream.getTracks().forEach(function (track) {
        track.stop();
      });
      ExamdAutoProctorJS.vstream = null;
      ExamdAutoProctorJS.recording = false;
      ExamdAutoProctorJS.endVideoFeed();
    }

    if (ExamdAutoProctorJS.sstream) {
      ExamdAutoProctorJS.sstream.getTracks().forEach(function (track) {
        track.stop();
      });
      ExamdAutoProctorJS.sstream = null;
      ExamdAutoProctorJS.endScreenFeed();
    }
  },

  /*
        GET ajax call
    */
  sendGetData: function (ep) {
    $.ajax({
      url: ep,
      type: "GET",
      success: function (returnData) {
        return {
          status: 0,
          data: returnData,
        };
      },
      error: function (xhr, status, error) {
        return {
          status: 1,
          data: error,
        };
      },
    });
  },

  /*
        POST ajax call (form post)
    */
  sendFormPost: function (ep, fdata) {
    $.ajax({
      url: ep,
      type: "POST",
      data: fdata,
      cache: false,
      contentType: false,
      proceessData: false,
      success: function (returnData) {
        return {
          status: 0,
          data: returnData,
        };
      },
      error: function (xhr, status, error) {
        return {
          status: 1,
          data: error,
        };
      },
    });
  },

  /*
        Convert data URL to Blob
    */
  convertDataUrl2Blob: function (dataurl) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  },

  /*
        Send Video feed
    */
  sendVideoFeed: function (blobData) {
    var jsn = {
      evt: "uploadvideo",
      payload: {
        filename: ExamdAutoProctorJS.randomExamId + "_vdo",
        mimetype: "video/" + ExamdAutoProctorJS.vdoextn,
      },
    };
    jsn.file = blobData;
    ExamdAutoProctorJS.xsock.emit("video", jsn);
  },

  /*
        Send Video End feed
    */
  endVideoFeed: function () {
    var jsn = {
      evt: "complete",
      payload: {
        filename: ExamdAutoProctorJS.randomExamId + "_vdo",
        mimetype: "video/" + ExamdAutoProctorJS.vdoextn,
      },
    };
    ExamdAutoProctorJS.xsock.emit("video", jsn);
  },

  /*
        Send Screen feed
    */
  sendScreenFeed: function (blobData) {
    var jsn = {
      evt: "uploadvideo",
      payload: {
        filename: ExamdAutoProctorJS.randomExamId + "_scr",
        mimetype: "video/" + ExamdAutoProctorJS.scrextn,
      },
    };
    jsn.file = blobData;
    ExamdAutoProctorJS.xsock.emit("video", jsn);
  },

  /*
        Send Screen End feed
    */
  endScreenFeed: function () {
    var jsn = {
      evt: "complete",
      payload: {
        filename: ExamdAutoProctorJS.randomExamId + "_scr",
        mimetype: "video/" + ExamdAutoProctorJS.scrextn,
      },
    };
    ExamdAutoProctorJS.xsock.emit("video", jsn);
  },

  /*
        Get Media
    */
  getMedia: function (fileId) {
    if (!ExamdAutoProctorJS.libraryInited) return null;
    const mda_url = ExamdAutoProctorJS.media_url.replace("{ID}", fileId);
    window.open(mda_url);
  },
};
