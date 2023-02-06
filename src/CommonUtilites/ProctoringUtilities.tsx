export {}

// import axios, { AxiosError, AxiosResponse } from "axios";
// import { io } from "socket.io-client";

// let version: boolean | null = null;
// let curr_version: boolean | null = null;
// let auth_url: string | null = null;
// let policy_url: boolean | null = null;
// let rules_url: boolean | null = null;
// let media_url: boolean | null = null;
// let update_url: string = "https://examd.online/cdn/urls/xproctor/1";
// let htvdofeed_url: boolean | null = null;
// let socketEp: string | null = null;

// let authUser: string = "none";
// let authPass: string = "none";
// let fullResponse: any = null;
// let authToken: string | null = null;

// let basicAuthToken: string = "Basic VEl4QXBaZTdNQ29zVzY6cFUxVVJ6akdrWThRVkM=";
// let expireTime: Date | null = null;
// let libraryInited: boolean = false;
// let randomExamId: string | null = null;

// let xvideo: JQuery<HTMLElement> | null = null;
// let xcanvas: JQuery<HTMLElement> | null = null;
// let ctxcnvs: boolean | null = null;
// let vstream: boolean | null = null;
// let sstream: boolean | null = null;
// let vdoextn: boolean | null = null;
// let scrextn: boolean | null = null;
// let recording: boolean = false;
// let capVdoRqst: boolean = false;
// let capAudRqst: boolean = false;
// let capScrRqst: boolean = false;

// let xsock: any = null;
// let sockConnected: boolean = false;

// let aiProcessInitURL: string = "https://examd.online/ai/frame/init";
// let aiImgPostURL: string = "https://examd.online/ai/frame/process";
// let aiProcessEndURL: string = "https://examd.online/ai/frame/fin";
// let frame: number = 0;

// export const initAIProcess = function (id: any, callback: () => void) {
//   const formData: FormData = new FormData();
//   formData.append("name", id);

//   // xhr call to init AI process
//   const xhr: XMLHttpRequest = new XMLHttpRequest();
//   xhr.open("POST", aiProcessInitURL);
//   xhr.setRequestHeader("Authorization", basicAuthToken);

//   xhr.onload = function () {
//     // if (xhr.status === 200) {
//     //   console.log("initAIProcess success", xhr.responseText);
//     // } else {
//     //   console.log("initAIProcess failed");
//     // }
//   };
//   xhr.send(formData);
// };

// export const sendImageToAI = function (id: any, images: any) {
//   const formData: FormData = new FormData();
//   formData.append("name", id);
//   ExamdAutoProctorJS.frame += 1;
//   formData.append("frame", "" + frame);
//   formData.append("image", images, id + ".webp");

//   //xml http request to send image to AI process
//   const xhr: XMLHttpRequest = new XMLHttpRequest();
//   xhr.open("POST", ExamdAutoProctorJS.aiImgPostURL, true);
//   xhr.setRequestHeader("Authorization", ExamdAutoProctorJS.basicAuthToken);
//   // xhr.onreadystatechange = () => {
//   //   if (xhr.readyState == XMLHttpRequest.DONE) {
//   //     const parsedData = JSON.parse(xhr.responseText);
//   //     if (parsedData.data.violation !== 0) {
//   //       window.localStorage.setItem(
//   //         "violation",
//   //         JSON.stringify({
//   //           message: parsedData.data.messages,
//   //           timestamp: new Date().toISOString(),
//   //         })
//   //       );
//   //     }
//   //   }
//   // };
//   // xhr.onload = function () {};
//   xhr.send(formData);
// };

// export const endAIProcess = function (id: any, callback: () => void) {
//   const formData: FormData = new FormData();
//   formData.append("name", id);
//   formData.append("fps", "" + 1);
//   formData.append("vdotype", "B");
//   var xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function () {};
//   xhr.open("POST", aiProcessEndURL, true);
//   xhr.setRequestHeader(
//     "Authorization",
//     "Basic VEl4QXBaZTdNQ29zVzY6cFUxVVJ6akdrWThRVkM="
//   );
//   xhr.setRequestHeader("Content-Type", "multipart/form-data");
//   xhr.send(formData);
// };

// export const initSocket = async function () {
//   const sockt = io(socketEp as string, {
//     reconnectionDelayMax: 10000,
//   });
//   sockt.on("connect", () => {
//     sockConnected = true;
//   });
//   sockt.on("disconnect", () => {
//     sockConnected = false;
//   });

//   return sockt;
// };

// const checkJquery = function () {
//   return !(typeof jQuery === "undefined");
// };

// export const checkSockIO = function () {
//   return !(typeof io === "undefined");
// };

// export const getVersion = function () {
//   return version;
// };

// export const setCredentials = function (usr: string, pwd: string) {
//   if (!libraryInited) return null;
//   authUser = usr;
//   authPass = pwd;
// };

// export const getDevicesSync = function () {
//   if (!libraryInited) return null;
//   return new Promise((resolve, reject) => {
//     getDevices((successResponse) => {
//       resolve(successResponse);
//     });
//   });
// };

// export const bandwidthCheck = function () {
//     if (!libraryInited) return null;

//     // if (navigator.connection) {
//     //   if (navigator.connection.downlink >= 4) {
//     //     return true;
//     //   }
//     // } else {

//     //   return true;
//     // }

//     return false;
//   }

// export const browserSupport = function () {
//   if (!libraryInited) return null;
//   let agent = navigator.userAgent;
//   let name, version, major, versTag;
//   name = versTag = "none";
//   version = "0.0";

//   if ((versTag = agent.lastIndexOf("Edg/")) != -1) {
//     name = "Edge";
//     version = agent.substring(versTag + 4);
//   } else if ((versTag = agent.lastIndexOf("MSIE")) != -1) {
//     name = "MS Internet Explorer";
//     version = agent.substring(versTag + 5);
//   } else if ((versTag = agent.lastIndexOf("Firefox")) != -1) {
//     name = "Firefox";
//     version = agent.substring(versTag + 8);
//   } else if ((versTag = agent.indexOf("Chrome")) != -1) {
//     name = "Chrome";
//     version = agent.substring(versTag + 7);
//   } else if ((versTag = agent.lastIndexOf("Safari")) != -1) {
//     name = "Safari";
//     version = agent.substring(versTag + 7);
//     if ((versTag = agent.lastIndexOf("Version")) != -1) {
//       version = agent.substring(versTag + 8);
//     }
//   }

//   major = parseInt(version.substring(0, version.indexOf(".")));
//   if ((name === "Chrome" && major > 95) || (name === "Edge" && major > 96)) {
//     return true;
//   }

//   return false;
// };

// export const getDefaultAudioVideoSync = function () {
//   if (!ExamdAutoProctorJS.libraryInited) return null;
//   return new Promise((resolve, reject) => {
//     getDefaultAudioVideo((successResponse) => {
//       resolve(successResponse);
//     });
//   });
// };

// export const getSupportedMediaMime = function () {
//   var options, extn;
//   if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
//     options = { mimeType: "video/webm; codecs=vp9" };
//     extn = "webm";
//   } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
//     options = { mimeType: "video/webm; codecs=vp8" };
//     extn = "webm";
//   } else {
//     options = { mimeType: "video/mp4" };
//     extn = "mp4";
//   }

//   return {
//     options: options,
//     extn: extn,
//   };
// };

// export const getDefaultAudioVideo = function (cback: (data: any) => void) {
//   if (!libraryInited) return null;
//   getDevices(function (dvc) {
//     if (dvc == null) {
//       cback({
//         status: 1,
//         audioInFound: false,
//         audioOutFound: false,
//         videoInFound: false,
//         audioInDevice: null,
//         audioOutDevice: null,
//         videoInDevice: null,
//       });
//     }
//     let dfltAudioIn: any = null;
//     let dfltAudioOut: any = null;
//     let dfltVideoIn: any = null;
//     $.each(dvc["audioinput"], function (index, dv) {
//       if (dfltAudioIn === null) {
//         dfltAudioIn = dv;
//       } else if (dv.deviceId === "default") {
//         dfltAudioIn = dv;
//       }
//     });
//     $.each(dvc["audiooutput"], function (index, dv) {
//       if (dfltAudioOut === null) {
//         dfltAudioOut = dv;
//       } else if (dv.deviceId === "default") {
//         dfltAudioOut = dv;
//       }
//     });
//     $.each(dvc["videoinput"], function (index, dv) {
//       if (dfltVideoIn === null) {
//         dfltVideoIn = dv;
//       } else if (dv.deviceId === "default") {
//         dfltVideoIn = dv;
//       }
//     });
//     cback({
//       status: 0,
//       audioInFound: dfltAudioIn !== null,
//       audioOutFound: dfltAudioOut !== null,
//       videoInFound: dfltVideoIn !== null,
//       audioInDevice: dfltAudioIn,
//       audioOutDevice: dfltAudioOut,
//       videoInDevice: dfltVideoIn,
//     });
//   });
// };

// export const getDevices = function (cback: (devices: any) => void) {
//   if (!ExamdAutoProctorJS.libraryInited) return null;
//   if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
//     let devList: any = [];
//     // Get user permission
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then(() => navigator.mediaDevices.enumerateDevices())
//       .then((device) => {
//         $.each(device, function (index, dv) {
//           const thisNode = {
//             name: dv.label,
//             deviceId: dv.deviceId,
//             groupId: dv.groupId,
//           };
//           if (!devList[dv.kind]) {
//             let newArr = new Array();
//             newArr.push(thisNode);
//             devList[dv.kind] = newArr;
//           } else {
//             devList[dv.kind].push(thisNode);
//           }
//         });

//         cback(devList);
//       });
//   } else {
//     return null;
//   }
// };

// export const doAuthSync = function () {
//   if (!libraryInited) return null;
//   return new Promise((resolve, reject) => {
//     doAuth(
//       (successResponse) => {
//         resolve(successResponse);
//       },
//       (errorResponse) => {
//         reject(errorResponse);
//       }
//     );
//   });
// };

// export const doAuth = function (
//   onSuccessCallback: (response: any) => void,
//   onFailureCallback: (jqXHR: any, status: string, error: AxiosError) => void
// ) {
//   if (!libraryInited) return null;
//   if (expireTime === null || expireTime <= new Date()) {
//     var data = "username=" + authUser + "&password=" + authPass;

//     axios
//       .post(auth_url as string, data, {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
//         },
//       })
//       .then((response: AxiosResponse) => {
//         fullResponse = response.data;
//         var splitToken = JSON.parse(
//           atob(response.data.access_token.split(".")[1])
//         );
//         var expire = new Date(splitToken.exp * 1000);
//         authToken = "Bearer " + response.data.access_token;
//         expireTime = expire;
//         if (onSuccessCallback !== undefined) {
//           onSuccessCallback(response.data);
//         }
//       })
//       .catch((error: AxiosError) => {
//         if (onFailureCallback !== undefined) {
//           onFailureCallback("", error.status as string, error);
//         }
//       });
//     // $.ajax({
//     //   type: "POST",
//     //   url: auth_url,
//     //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     //   contentType: "application/x-www-form-urlencoded; charset=utf-8",
//     //   data: data,
//     //   success: function (response) {
//     //     fullResponse = response;
//     //     var splitToken = JSON.parse(atob(response.access_token.split(".")[1]));
//     //     var expire = new Date(splitToken.exp * 1000);
//     //     authToken = "Bearer " + response.access_token;
//     //     expireTime = expire;
//     //     if (onSuccessCallback !== undefined) {
//     //       onSuccessCallback(response);
//     //     }
//     //   },
//     //   error: function (jqXHR, textStatus, error) {
//     //     if (onFailureCallback !== undefined) {
//     //       onFailureCallback(jqXHR, textStatus, error);
//     //     }
//     //   },
//     // });
//   } else {
//     if (onSuccessCallback !== undefined) {
//       onSuccessCallback(fullResponse);
//     }
//   }
// };

// export const initLibrary = async function () {
//   if (checkJquery() && checkSockIO()) {
//     // Generate Random Exam ID
//     randomExamId = crypto.randomUUID() as string;

//     // Get the URLs
//     var result = await $.ajax({
//       type: "GET",
//       url: update_url,
//     });

//     aiProcessInitURL = result.ai_init;
//     aiImgPostURL = result.ai_process;
//     aiProcessEndURL = result.ai_finish;

//     if (result.name === "xproctor") {
//       version = result.version;
//       curr_version = result.curr_version;
//       auth_url = result.auth_url;
//       policy_url = result.policy_url;
//       rules_url = result.rules_url;
//       (htvdofeed_url = result.htvdoinit_url),
//         (socketEp = result.socketEp),
//         (media_url = result.media_url),
//         // Now add a video and a canvas component
//         (xvideo = $("<video />", {
//           id: "xvideo",
//           type: "video/webm",
//           controls: true,
//           width: "480",
//           height: "320",
//           muted: "muted",
//         }));

//       xcanvas = $("<canvas />", {
//         id: "xcanvas",
//         width: "480",
//         height: "320",
//       });

//       xsock = await initSocket();
//       libraryInited = true;
//     }

//     return {
//       status: 0,
//       jqueryCheck: true,
//       socketioCheck: true,
//       socketId: xsock?.id,
//       assignedId: ExamdAutoProctorJS.randomExamId,
//     };
//   }

//   return {
//     status: 1,
//     jqueryCheck: checkJquery(),
//     socketioCheck: checkSockIO(),
//   };
// };

// export const ExamdAutoProctorJS = {
//   /*
// This library is used for adding Auto Proctoring support to 3rd party applications.
// It needs JQuery as a dependency
// */

//   version: null,
//   curr_version: null,
//   auth_url: null,
//   policy_url: null,
//   rules_url: null,
//   media_url: null,
//   update_url: "https://examd.online/cdn/urls/xproctor/1",
//   htvdofeed_url: null,
//   socketEp: null,

//   /* Session Variables */
//   authUser: "none",
//   authPass: "none",
//   fullResponse: null,
//   authToken: null,
//   // basicAuthToken: "Basic TIxApZe7MCosW6:pU1URzjGkY8QVC",
//   basicAuthToken: "Basic VEl4QXBaZTdNQ29zVzY6cFUxVVJ6akdrWThRVkM=",
//   expireTime: null,
//   libraryInited: false,
//   randomExamId: null,

//   /* Video */
//   xvideo: null,
//   xcanvas: null,
//   ctxcnvs: null,
//   vstream: null,
//   sstream: null,
//   vdoextn: null,
//   scrextn: null,
//   recording: false,

//   capVdoRqst: false,
//   capAudRqst: false,
//   capScrRqst: false,

//   /* Socket */
//   xsock: null,
//   sockConnected: false,

//   /* AI process init, end  APIs*/
//   aiProcessInitURL: "https://examd.online/ai/frame/init",
//   aiImgPostURL: "https://examd.online/ai/frame/process",
//   aiProcessEndURL: "https://examd.online/ai/frame/fin",

//   frame: 0,

//   /*
// Get Supported Media type
// */

//   /*
// Verify Audio/ Video defaults
// Return AudioInput, AudioOutput and VideoInput as Promise
// */

//   /*
// Browser Check
// We support Chrome and Edge only with version 
// */

//   /*
// Location Bandwidth check
// */
  

//   /*
// Get Privacy Policy
// */
//   getPrivacyPolicy: async function (instituteId) {
//     if (!ExamdAutoProctorJS.libraryInited) return null;
//     const token = await ExamdAutoProctorJS.doAuthSync();
//     const auth_tkn = token.token_type + " " + token.access_token;
//     const pol_url = ExamdAutoProctorJS.policy_url.replace("{ID}", instituteId);

//     try {
//       var result = await $.ajax({
//         type: "GET",
//         url: pol_url,
//         beforeSend: function (xhr) {
//           xhr.setRequestHeader("Authorization", auth_tkn);
//         },
//       });

//       return {
//         status: 0,
//         msg: result,
//       };
//     } catch (error) {
//       return {
//         status: 1,
//         msg: error,
//       };
//     }
//   },

//   /*
// Get Exam Rules
// */
//   getExamRules: async function (instituteId) {
//     if (!ExamdAutoProctorJS.libraryInited) return null;
//     const token = await ExamdAutoProctorJS.doAuthSync();
//     const auth_tkn = token.token_type + " " + token.access_token;
//     const pol_url = ExamdAutoProctorJS.rules_url.replace("{ID}", instituteId);

//     try {
//       var result = await $.ajax({
//         type: "GET",
//         url: pol_url,
//         beforeSend: function (xhr) {
//           xhr.setRequestHeader("Authorization", auth_tkn);
//         },
//       });

//       return {
//         status: 0,
//         msg: result,
//       };
//     } catch (error) {
//       return {
//         status: 1,
//         msg: error,
//       };
//     }
//   },

//   /*
// Open Media Channels
// */
//   openChannels: async function (
//     capVdo,
//     capAdo,
//     capScr,
//     showVdo,
//     excpCallback,
//     logCallback
//   ) {
//     if (!ExamdAutoProctorJS.libraryInited) return null;
//     if ($("#xmedia").length) {
//       xvideo.appendTo($("#xmedia"));
//       xcanvas.appendTo($("#xmedia"));
//       if (!showVdo) xvideo.css("display", "none");
//       if (!showVdo) xcanvas.css("display", "none");
//     } else {
//       console.error("Error: No xmedia div");
//       return {
//         status: 1,
//         msg: "Please add a div named xmedia in code...",
//       };
//     }

//     var medias = await ExamdAutoProctorJS.getDefaultAudioVideoSync();
//     if (medias.status === 0) {
//       // Is media available
//       if (capVdo && !medias.videoInFound) {
//         return {
//           status: 1,
//           msg: "Video requested, but no corresponding device",
//         };
//       }
//       if (capAdo && !medias.audioInFound) {
//         return {
//           status: 1,
//           msg: "Audio requested, but no corresponding device",
//         };
//       }

//       // Set On Message for Socket
//       ExamdAutoProctorJS.xsock.on("message", (txt) => {
//         if (excpCallback) excpCallback(txt);
//       });
//       ExamdAutoProctorJS.xsock.on("screen", (txt) => {
//         if (logCallback) logCallback(txt);
//       });

//       // Now let's start media
//       var optExtn = ExamdAutoProctorJS.getSupportedMediaMime();
//       if (capVdo || capAdo) {
//         try {
//           var options = optExtn.options;
//           ExamdAutoProctorJS.vdoextn = optExtn.extn;
//           var constraints = {
//             video: capVdo,
//             audio: capAdo,
//             mimeType: options.mimeType,
//           };

//           var adoVdo = await navigator.mediaDevices.getUserMedia(constraints);
//           ExamdAutoProctorJS.vstream = adoVdo;

//           // Let's add this to video stream
//           var video = $("#xvideo")[0];
//           video.srcObject = adoVdo;
//           video.load();
//           video.play();
//           ExamdAutoProctorJS.recording = true;

//           // Get Video context
//           var canvas = $("#xcanvas")[0];
//           var last = 0;
//           var ctxcnvs = canvas.getContext("2d");
//           ExamdAutoProctorJS.initAIProcess(
//             ExamdAutoProctorJS.randomExamId,
//             ExamdAutoProctorJS.callback
//           );
//           video.addEventListener("play", () => {
//             function step(now) {
//               if (!last || now - last >= 1 * 1000) {
//                 last = now;
//                 ctxcnvs.drawImage(video, 0, 0, canvas.width, canvas.height);

//                 // Send image and check for Student violations here
//                 var jsn = {
//                   evt: "detect",
//                   payload: {
//                     filename: "tempfile.png",
//                   },
//                 };
//                 var dataUrl = canvas.toDataURL("image/png");
//                 var blobdata = ExamdAutoProctorJS.convertDataUrl2Blob(dataUrl);
//                 jsn.file = blobdata;
//                 ExamdAutoProctorJS.sendImageToAI(
//                   ExamdAutoProctorJS.randomExamId,
//                   blobdata
//                 );
//                 // ExamdAutoProctorJS.xsock.emit("scene", jsn);
//               }

//               if (ExamdAutoProctorJS.recording) {
//                 requestAnimationFrame(step);
//               }
//             }
//             requestAnimationFrame(step);
//           });
//         } catch (err) {
//           console.error("Error: " + err);
//           return {
//             status: 1,
//             msg: "Permission denied",
//           };
//         }
//       }

//       if (capScr) {
//         try {
//           var options = optExtn.options;
//           ExamdAutoProctorJS.scrextn = optExtn.extn;
//           var constraints = {
//             video: capScr,
//             audio: false,
//             mimeType: options.mimeType,
//           };

//           var scrStm = await navigator.mediaDevices.getDisplayMedia(
//             constraints
//           );
//           ExamdAutoProctorJS.sstream = scrStm;
//         } catch (err) {
//           console.error("Error: " + err);
//           return {
//             status: 1,
//             msg: "Permission denied",
//           };
//         }
//       }

//       ExamdAutoProctorJS.capVdoRqst = capVdo;
//       ExamdAutoProctorJS.capAudRqst = capAdo;
//       ExamdAutoProctorJS.capScrRqst = capScr;

//       return {
//         status: 0,
//         msg: "Channels opened",
//       };
//     } else {
//       return {
//         status: 1,
//         msg: "Cannot retrieve default devices",
//       };
//     }
//   },

//   /*
// Start recording Video
// */
//   startVideoRecording: function () {
//     if (!ExamdAutoProctorJS.libraryInited) return null;
//     if (!ExamdAutoProctorJS.vstream) return null;
//     var mrecorder = new MediaRecorder(ExamdAutoProctorJS.vstream);
//     mrecorder.ondataavailable = function (e) {
//       ExamdAutoProctorJS.sendVideoFeed(e.data);
//     };
//     mrecorder.start(5000);
//     ExamdAutoProctorJS.recording = true;
//   },

//   /*
// Start recording Screen
// */
//   startScreenRecording: function () {
//     if (!ExamdAutoProctorJS.libraryInited) return null;
//     if (!ExamdAutoProctorJS.sstream) return null;
//     var mrecorder = new MediaRecorder(ExamdAutoProctorJS.sstream);
//     mrecorder.ondataavailable = function (e) {
//       ExamdAutoProctorJS.sendScreenFeed(e.data);
//     };
//     mrecorder.start(5000);
//   },

//   /*
// Start recording
// */
//   startRecording: function () {
//     if (!ExamdAutoProctorJS.libraryInited) return null;
//     if (!ExamdAutoProctorJS.sstream) return null;

//     if (ExamdAutoProctorJS.capVdoRqst || ExamdAutoProctorJS.capAudRqst) {
//       ExamdAutoProctorJS.startVideoRecording();
//     }

//     if (ExamdAutoProctorJS.capScrRqst) {
//       ExamdAutoProctorJS.startScreenRecording();
//     }
//   },

//   /*
// Remove Channels
// */
//   stopRecording: function () {
//     if (!ExamdAutoProctorJS.libraryInited) return null;
//     ExamdAutoProctorJS.endAIProcess(
//       ExamdAutoProctorJS.randomExamId,
//       ExamdAutoProctorJS.callback
//     );
//     if (ExamdAutoProctorJS.vstream) {
//       ExamdAutoProctorJS.vstream.getTracks().forEach(function (track) {
//         track.stop();
//       });
//       ExamdAutoProctorJS.vstream = null;
//       ExamdAutoProctorJS.recording = false;
//       ExamdAutoProctorJS.endVideoFeed();
//     }

//     if (ExamdAutoProctorJS.sstream) {
//       ExamdAutoProctorJS.sstream.getTracks().forEach(function (track) {
//         track.stop();
//       });
//       ExamdAutoProctorJS.sstream = null;
//       ExamdAutoProctorJS.endScreenFeed();
//     }
//   },

//   /*
// GET ajax call
// */
//   sendGetData: function (ep) {
//     $.ajax({
//       url: ep,
//       type: "GET",
//       success: function (returnData) {
//         return {
//           status: 0,
//           data: returnData,
//         };
//       },
//       error: function (xhr, status, error) {
//         return {
//           status: 1,
//           data: error,
//         };
//       },
//     });
//   },

//   /*
// POST ajax call (form post)
// */
//   sendFormPost: function (ep, fdata) {
//     $.ajax({
//       url: ep,
//       type: "POST",
//       data: fdata,
//       cache: false,
//       contentType: false,
//       proceessData: false,
//       success: function (returnData) {
//         return {
//           status: 0,
//           data: returnData,
//         };
//       },
//       error: function (xhr, status, error) {
//         return {
//           status: 1,
//           data: error,
//         };
//       },
//     });
//   },

//   /*
// Convert data URL to Blob
// */
//   convertDataUrl2Blob: function (dataurl) {
//     var arr = dataurl.split(","),
//       mime = arr[0].match(/:(.*?);/)[1],
//       bstr = atob(arr[1]),
//       n = bstr.length,
//       u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new Blob([u8arr], { type: mime });
//   },

//   /*
// Send Video feed
// */
//   sendVideoFeed: function (blobData) {
//     var jsn = {
//       evt: "uploadvideo",
//       payload: {
//         filename: ExamdAutoProctorJS.randomExamId + "_vdo",
//         mimetype: "video/" + ExamdAutoProctorJS.vdoextn,
//       },
//     };
//     jsn.file = blobData;
//     ExamdAutoProctorJS.xsock.emit("video", jsn);
//   },

//   /*
// Send Video End feed
// */
//   endVideoFeed: function () {
//     var jsn = {
//       evt: "complete",
//       payload: {
//         filename: ExamdAutoProctorJS.randomExamId + "_vdo",
//         mimetype: "video/" + ExamdAutoProctorJS.vdoextn,
//       },
//     };
//     ExamdAutoProctorJS.xsock.emit("video", jsn);
//   },

//   /*
// Send Screen feed
// */
//   sendScreenFeed: function (blobData) {
//     var jsn = {
//       evt: "uploadvideo",
//       payload: {
//         filename: ExamdAutoProctorJS.randomExamId + "_scr",
//         mimetype: "video/" + ExamdAutoProctorJS.scrextn,
//       },
//     };
//     jsn.file = blobData;
//     ExamdAutoProctorJS.xsock.emit("video", jsn);
//   },

//   /*
// Send Screen End feed
// */
//   endScreenFeed: function () {
//     var jsn = {
//       evt: "complete",
//       payload: {
//         filename: ExamdAutoProctorJS.randomExamId + "_scr",
//         mimetype: "video/" + ExamdAutoProctorJS.scrextn,
//       },
//     };
//     ExamdAutoProctorJS.xsock.emit("video", jsn);
//   },

//   /*
// Get Media
// */
//   getMedia: function (fileId) {
//     if (!ExamdAutoProctorJS.libraryInited) return null;
//     const mda_url = ExamdAutoProctorJS.media_url.replace("{ID}", fileId);
//     window.open(mda_url);
//   },
// };
