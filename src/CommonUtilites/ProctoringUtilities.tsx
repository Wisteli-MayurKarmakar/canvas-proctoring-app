import axios, { AxiosError, AxiosResponse } from "axios";
import { io } from "socket.io-client";
import { ViolationMessage } from "../AppTypes";
import { useViolationStore } from "../store/ViolationStore";
import $ from "jquery"

let updateUrl: string | undefined = process.env.REACT_APP_UPDATE_URL;
let aiInitUrl: string | undefined = process.env.REACT_APP_AI_INIT_URL;
let aiImgPostUrl: string | undefined = process.env.REACT_APP_AI_IMG_POST_URL;
let aiEndUrl: string | undefined = process.env.REACT_APP_AI_END_URL;

let version: any = null;
let curr_version: any = null;
let auth_url: string | null = null;
let policy_url: any = null;
let rules_url: any = null;
let media_url: any = null;
let update_url: string = updateUrl as string;
let htvdofeed_url: boolean | null = null;
let socketEp: string | null = null;

let authUser: string = "none";
let authPass: string = "none";
let fullResponse: any = null;
let authToken: string | null = null;

let basicAuthToken: string = "Basic VEl4QXBaZTdNQ29zVzY6cFUxVVJ6akdrWThRVkM=";
let expireTime: Date | null = null;
let libraryInited: boolean = false;
export let randomExamId: string | null = null;

let xvideo: JQuery<HTMLElement> | null = null;
let xcanvas: JQuery<HTMLElement> | null = null;
let ctxcnvs: any = null;
let vstream: any = null;
let sstream: any = null;
let vdoextn: any = null;
let scrextn: any = null;
let recording: boolean = false;
let capVdoRqst: boolean = false;
let capAudRqst: boolean = false;
let capScrRqst: boolean = false;

let xsock: any = null;
let sockConnected: boolean = false;

let aiProcessInitURL: string = aiInitUrl as string;
let aiImgPostURL: string = aiImgPostUrl as string;
let aiProcessEndURL: string = aiEndUrl as string;
let frame: number = 0;

export const initAIProcess = function (id: any) {
  const formData: FormData = new FormData();
  formData.append("name", id);

  // xhr call to init AI process
  const xhr: XMLHttpRequest = new XMLHttpRequest();
  xhr.open("POST", aiProcessInitURL);
  xhr.setRequestHeader("Authorization", basicAuthToken);

  xhr.onload = function () {
    // if (xhr.status === 200) {
    //   console.log("initAIProcess success", xhr.responseText);
    // } else {
    //   console.log("initAIProcess failed");
    // }
  };
  xhr.send(formData);
};

export const sendImageToAI = function (id: any, images: any) {
  const formData: FormData = new FormData();
  formData.append("name", id);
  frame += 1;
  formData.append("frame", "" + frame);
  formData.append("image", images, id + ".webp");

  //xml http request to send image to AI process
  const xhr: XMLHttpRequest = new XMLHttpRequest();
  xhr.open("POST", aiImgPostURL, true);
  xhr.setRequestHeader("Authorization", basicAuthToken);
  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const parsedData = JSON.parse(xhr.responseText);
      if (parsedData.data.violation !== 0) {
        const setMessages = useViolationStore.getState().setMessages;
        let violationMessage: ViolationMessage = {
            message: parsedData.data.messages,
            timestamp: new Date().toISOString(),
          };
        setMessages(violationMessage);
      }
    }
  };
  // xhr.onload = function () {};
  xhr.send(formData);
};

export const endAIProcess = function (id: any) {
  const formData: FormData = new FormData();
  formData.append("name", id);
  formData.append("fps", "" + 1);
  formData.append("vdotype", "B");
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {};
  xhr.open("POST", aiProcessEndURL, true);
  xhr.setRequestHeader(
    "Authorization",
    "Basic VEl4QXBaZTdNQ29zVzY6cFUxVVJ6akdrWThRVkM="
  );
  xhr.setRequestHeader("Content-Type", "multipart/form-data");
  xhr.send(formData);
};

export const initSocket = async function () {
  const sockt = io(socketEp as string, {
    reconnectionDelayMax: 10000,
  });
  sockt.on("connect", () => {
    sockConnected = true;
  });
  sockt.on("disconnect", () => {
    sockConnected = false;
  });

  return sockt;
};

const checkJquery = function () {
  return !(typeof jQuery === "undefined");
};

export const checkSockIO = function () {
  return !(typeof io === "undefined");
};

export const getVersion = function () {
  return version;
};

export const setCredentials = function (usr: string, pwd: string) {
  if (!libraryInited) return null;
  authUser = usr;
  authPass = pwd;
};

export const getDevicesSync = function () {
  if (!libraryInited) return null;
  return new Promise((resolve, reject) => {
    getDevices((successResponse) => {
      resolve(successResponse);
    });
  });
};

export const bandwidthCheck = function () {
  if (!libraryInited) return null;

  // if (navigator.connection) {
  //   if (navigator.connection.downlink >= 4) {
  //     return true;
  //   }
  // } else {

  //   return true;
  // }

  return false;
};

export const browserSupport = function () {
  if (!libraryInited) return null;
  let agent = navigator.userAgent;
  let name, version, major, versTag;
  name = versTag = "none";
  version = "0.0";

  if ((versTag = agent.lastIndexOf("Edg/")) != -1) {
    name = "Edge";
    version = agent.substring(versTag + 4);
  } else if ((versTag = agent.lastIndexOf("MSIE")) != -1) {
    name = "MS Internet Explorer";
    version = agent.substring(versTag + 5);
  } else if ((versTag = agent.lastIndexOf("Firefox")) != -1) {
    name = "Firefox";
    version = agent.substring(versTag + 8);
  } else if ((versTag = agent.indexOf("Chrome")) != -1) {
    name = "Chrome";
    version = agent.substring(versTag + 7);
  } else if ((versTag = agent.lastIndexOf("Safari")) != -1) {
    name = "Safari";
    version = agent.substring(versTag + 7);
    if ((versTag = agent.lastIndexOf("Version")) != -1) {
      version = agent.substring(versTag + 8);
    }
  }

  major = parseInt(version.substring(0, version.indexOf(".")));
  if ((name === "Chrome" && major > 95) || (name === "Edge" && major > 96)) {
    return true;
  }

  return false;
};

export const getDefaultAudioVideoSync = function () {
  if (!libraryInited) return null;
  return new Promise((resolve, reject) => {
    getDefaultAudioVideo((successResponse) => {
      resolve(successResponse);
    });
  });
};

export const getSupportedMediaMime = function () {
  let options, extn;
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
};

export const getDefaultAudioVideo = function (cback: (data: any) => void) {
  if (!libraryInited) return null;
  getDevices(function (dvc) {
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
    let dfltAudioIn: any = null;
    let dfltAudioOut: any = null;
    let dfltVideoIn: any = null;
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
};

export const getDevices = function (cback: (devices: any) => void) {
  if (!libraryInited) return null;
  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    let devList: any = [];
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
            let newArr = new Array();
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
};

export const doAuthSync = function () {
  if (!libraryInited) return null;
  return new Promise((resolve, reject) => {
    doAuth(
      (successResponse) => {
        resolve(successResponse);
      },
      (errorResponse) => {
        reject(errorResponse);
      }
    );
  });
};

export const doAuth = function (
  onSuccessCallback: (response: any) => void,
  onFailureCallback: (jqXHR: any, status: string, error: AxiosError) => void
) {
  if (!libraryInited) return null;
  if (expireTime === null || expireTime <= new Date()) {
    let data = "username=" + authUser + "&password=" + authPass;

    axios
      .post(auth_url as string, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
      })
      .then((response: AxiosResponse) => {
        fullResponse = response.data;
        let splitToken = JSON.parse(
          atob(response.data.access_token.split(".")[1])
        );
        let expire = new Date(splitToken.exp * 1000);
        authToken = "Bearer " + response.data.access_token;
        expireTime = expire;
        if (onSuccessCallback !== undefined) {
          onSuccessCallback(response.data);
        }
      })
      .catch((error: AxiosError) => {
        if (onFailureCallback !== undefined) {
          onFailureCallback("", error.status as string, error);
        }
      });
    // $.ajax({
    //   type: "POST",
    //   url: auth_url,
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   contentType: "application/x-www-form-urlencoded; charset=utf-8",
    //   data: data,
    //   success: function (response) {
    //     fullResponse = response;
    //     let splitToken = JSON.parse(atob(response.access_token.split(".")[1]));
    //     let expire = new Date(splitToken.exp * 1000);
    //     authToken = "Bearer " + response.access_token;
    //     expireTime = expire;
    //     if (onSuccessCallback !== undefined) {
    //       onSuccessCallback(response);
    //     }
    //   },
    //   error: function (jqXHR, textStatus, error) {
    //     if (onFailureCallback !== undefined) {
    //       onFailureCallback(jqXHR, textStatus, error);
    //     }
    //   },
    // });
  } else {
    if (onSuccessCallback !== undefined) {
      onSuccessCallback(fullResponse);
    }
  }
};

export const initLibrary = async function () {
  if (checkJquery() && checkSockIO()) {
    // Generate Random Exam ID
    randomExamId = crypto.randomUUID() as string;

    // Get the URLs
    let result = await $.ajax({
      type: "GET",
      url: update_url,
    });

    aiProcessInitURL = result.ai_init;
    aiImgPostURL = result.ai_process;
    aiProcessEndURL = result.ai_finish;

    if (result.name === "xproctor") {
      version = result.version;
      curr_version = result.curr_version;
      auth_url = result.auth_url;
      policy_url = result.policy_url;
      rules_url = result.rules_url;
      htvdofeed_url = result.htvdoinit_url;
      socketEp = result.socketEp;
      media_url = result.media_url;
      // Now add a video and a canvas component
      xvideo = $("<video />", {
        id: "xvideo",
        type: "video/webm",
        controls: true,
        width: "480",
        height: "320",
        muted: "muted",
      });

      xcanvas = $("<canvas />", {
        id: "xcanvas",
        width: "480",
        height: "320",
      });

      xsock = await initSocket();
      libraryInited = true;
    }

    return {
      status: 0,
      jqueryCheck: true,
      socketioCheck: true,
      socketId: xsock?.id,
      assignedId: randomExamId,
    };
  }

  return {
    status: 1,
    jqueryCheck: checkJquery(),
    socketioCheck: checkSockIO(),
  };
};

export const getPrivacyPolicy = async function (instituteId: any) {
  if (!libraryInited) return null;
  const token: any = await doAuthSync();
  const auth_tkn = token.token_type + " " + token.access_token;
  const pol_url = policy_url.replace("{ID}", instituteId);

  try {
    const result = await $.ajax({
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
};

export const getExamRules = async function (instituteId: any) {
  if (!libraryInited) return null;
  const token: any = await doAuthSync();
  const auth_tkn = token.token_type + " " + token.access_token;
  const pol_url = rules_url.replace("{ID}", instituteId);

  try {
    const result = await $.ajax({
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
};

export const openChannels = async function (
  capVdo: any,
  capAdo: any,
  capScr: any,
  showVdo: any,
  excpCallback: any,
  logCallback: any
) {
  if (!libraryInited) return null;
  if ($("#xmedia").length) {
    xvideo?.appendTo($("#xmedia"));
    xcanvas?.appendTo($("#xmedia"));
    if (!showVdo) xvideo?.css("display", "none");
    if (!showVdo) xcanvas?.css("display", "none");
  } else {
    console.error("Error: No xmedia div");
    return {
      status: 1,
      msg: "Please add a div named xmedia in code...",
    };
  }

  let medias: any = await getDefaultAudioVideoSync();
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
    xsock.on("message", (txt: any) => {
      if (excpCallback) excpCallback(txt);
    });
    xsock.on("screen", (txt: any) => {
      if (logCallback) logCallback(txt);
    });

    // Now let's start media
    let optExtn = getSupportedMediaMime();
    if (capVdo || capAdo) {
      try {
        let options = optExtn.options;
        vdoextn = optExtn.extn;
        let constraints = {
          video: capVdo,
          audio: capAdo,
          mimeType: options.mimeType,
        };

        let adoVdo = await navigator.mediaDevices.getUserMedia(constraints);
        vstream = adoVdo;

        // Let's add this to video stream
        let video: any = $("#xvideo")[0];
        video.srcObject = adoVdo;
        video.load();
        video.play();
        recording = true;

        // Get Video context
        let canvas: any = $("#xcanvas")[0];
        let last = 0;
        let ctxcnvs = canvas.getContext("2d");
        initAIProcess(randomExamId);
        video.addEventListener("play", () => {
          function step(now: any) {
            if (!last || now - last >= 1 * 1000) {
              last = now;
              ctxcnvs.drawImage(video, 0, 0, canvas.width, canvas.height);

              // Send image and check for Student violations here
              let jsn: any = {
                evt: "detect",
                payload: {
                  filename: "tempfile.png",
                },
              };
              let dataUrl = canvas.toDataURL("image/png");
              let blobdata = convertDataUrl2Blob(dataUrl);
              jsn.file = blobdata;
              sendImageToAI(randomExamId, blobdata);
              // xsock.emit("scene", jsn);
            }

            if (recording) {
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
        const options = optExtn.options;
        scrextn = optExtn.extn;
        const constraints = {
          video: capScr,
          audio: false,
          mimeType: options.mimeType,
        };

        const scrStm = await navigator.mediaDevices.getDisplayMedia(
          constraints
        );
        sstream = scrStm;
      } catch (err) {
        console.error("Error: " + err);
        return {
          status: 1,
          msg: "Permission denied",
        };
      }
    }

    capVdoRqst = capVdo;
    capAudRqst = capAdo;
    capScrRqst = capScr;

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
};

/*
Start recording Video
*/
export const startVideoRecording = function () {
  if (!libraryInited) return null;
  if (!vstream) return null;
  let mrecorder = new MediaRecorder(vstream);
  mrecorder.ondataavailable = function (e) {
    sendVideoFeed(e.data);
  };
  mrecorder.start(5000);
  recording = true;
};

/*
Start recording Screen
*/
export const startScreenRecording = function () {
  if (!libraryInited) return null;
  if (!sstream) return null;
  let mrecorder = new MediaRecorder(sstream);
  mrecorder.ondataavailable = function (e) {
    sendScreenFeed(e.data);
  };
  mrecorder.start(5000);
};

/*
Start recording
*/
export const startRecording = function () {
  if (!libraryInited) return null;
  if (!sstream) return null;

  if (capVdoRqst || capAudRqst) {
    startVideoRecording();
  }

  if (capScrRqst) {
    startScreenRecording();
  }
};

/*
Remove Channels
*/
export const stopRecording = async function () {
  if (!libraryInited) return null;
  endAIProcess(randomExamId);
  if (vstream) {
    vstream.getTracks().forEach(function (track: any) {
      track.stop();
    });
    vstream = null;
    recording = false;
    endVideoFeed();
  }

  if (sstream) {
    sstream.getTracks().forEach(function (track: any) {
      track.stop();
    });
    sstream = null;
    endScreenFeed();
  }
};

/*
GET ajax call
*/
export const sendGetData = function (ep: any) {
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
};

/*
POST ajax call (form post)
*/
export const sendFormPost = async function (ep: any, fdata: any) {
  let result: any = null;
  try {
    result = await axios.post(ep, fdata);
    if (result.status === 200 || result.status === 201) {
      return {
        status: 0,
        data: result.data,
      };
    }
  } catch (err) {
    return {
      status: 1,
      data: err,
    };
  }
};

export const convertDataUrl2Blob = function (dataurl: any) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const sendVideoFeed = function (blobData: any) {
  let jsn: any = {
    evt: "uploadvideo",
    payload: {
      filename: randomExamId + "_vdo",
      mimetype: "video/" + vdoextn,
    },
  };
  jsn.file = blobData;
  xsock.emit("video", jsn);
};

export const endVideoFeed = function () {
  let jsn = {
    evt: "complete",
    payload: {
      filename: randomExamId + "_vdo",
      mimetype: "video/" + vdoextn,
    },
  };
  xsock.emit("video", jsn);
};

export const sendScreenFeed = function (blobData: any) {
  let jsn: any = {
    evt: "uploadvideo",
    payload: {
      filename: randomExamId + "_scr",
      mimetype: "video/" + scrextn,
    },
  };
  jsn.file = blobData;
  xsock.emit("video", jsn);
};

export const endScreenFeed = function () {
  let jsn = {
    evt: "complete",
    payload: {
      filename: randomExamId + "_scr",
      mimetype: "video/" + scrextn,
    },
  };
  xsock.emit("video", jsn);
};

export const getMedia = function (fileId: any) {
  if (!libraryInited) return null;
  const mda_url = media_url.replace("{ID}", fileId);
  window.open(mda_url);
};
