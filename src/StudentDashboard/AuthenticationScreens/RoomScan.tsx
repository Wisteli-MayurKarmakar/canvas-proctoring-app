import React, { useEffect } from "react";
import { getWebSocketUrl } from "../../APIs/apiservices";

interface Props {
  authToken: string;
  guid: string;
  studentId: string;
  courseId: string;
  quizId: string;
  rmVideoSent: (status: boolean) => void;
}

const RoomScan: React.FC<Props> = (props): JSX.Element => {
  let [isRecording, setIsRecording] = React.useState<any>(null);
  let [recordedMedia, setRecordedMedia] = React.useState<any>(null);
  let [mediaStream, setMediaStream] = React.useState<any>(null);
  const socket = getWebSocketUrl();
  let readyToSendVideo = isRecording === false && true;
  let liveCapSource = React.useRef<any>(null);
  let recordedCapSource = React.useRef<any>(null);

  const sendVideoFeed = (vdoChunks: any) => {
    let jsn: {
      [key: string]: any;
    } = {
      evt: "uploadvideo",
      payload: {
        filename:
          `${props.guid}_${props.courseId}_${props.quizId}_${props.studentId}` +
          "_rmvdo",
        mimetype: "video/" + "webm",
      },
    };
    jsn.file = vdoChunks;

    socket.emit("video", jsn);
  };

  const startRecording = async (stream: any) => {
    let recorder = new MediaRecorder(stream);
    let data: any = [];

    recorder.ondataavailable = (event) => {
      sendVideoFeed(event.data);
      data.push(event.data);
    };
    recorder.start();

    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = (event: any) => reject(event.name);
    });

    return Promise.all([stopped]).then(() => data);
  };

  const stop = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track: any) => track.stop());
    } else {
      //get tracks from the navigator.mediaDevices.getUserMedia and stop tracks
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream: any) => {
          recordedMedia = stream;
          recordedMedia.getTracks().forEach((track: any) => track.stop());
        });
    }
  };

  const handleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      handleStartRecording();
    } else {
      setIsRecording(false);
      stop();
    }
  };

  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setIsRecording(true);
        setMediaStream(stream);
        liveCapSource.current.srcObject = stream;
        liveCapSource.current.captureStream =
          liveCapSource.current.captureStream ||
          liveCapSource.current.mozCaptureStream;
        return new Promise(
          (resolve) => (liveCapSource.current.onplaying = resolve)
        );
      })
      .then(() => startRecording(liveCapSource.current.captureStream()))
      .then((recordedChunks: any) => {
        let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        recordedCapSource.current.src = URL.createObjectURL(recordedBlob);
        setRecordedMedia(recordedBlob);
      })
      .catch((error) => {
        if (error.name === "NotFoundError") {
          alert("Camera or microphone not found. Can't record.");
        } else {
          console.log(error);
        }
      });
  };

  const handleSendRoomScanVideo = () => {
    props.rmVideoSent(true);
  };

  useEffect(() => {
    socket.connect();
    stop();
  }, []);

  return (
    <div className="flex flex-col h-full items-center gap-10">
      {readyToSendVideo && (
        <div
          className="bg-yellow-100 rounded-lg py-5 px-6 font-semibold mb-4 text-base text-black"
          role="alert"
        >
          Please press the "Send" button to send the video and proceed. Thanks
        </div>
      )}
      <div className="flex flex-row items-center justify-center gap-10">
        <video
          ref={liveCapSource}
          autoPlay
          playsInline
          muted
          className="h-56 w-64 bg-black rounded"
        ></video>
        <video
          ref={recordedCapSource}
          controls
          className="h-56 w-64 bg-black rounded"
        ></video>
        <div className="flex space-x-2 justify-center">
          <button
            onClick={handleRecording}
            type="button"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
        </div>
      </div>
      {readyToSendVideo && (
        <div className="flex space-x-2 justify-center">
          <button
            type="button"
            onClick={handleSendRoomScanVideo}
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Send
          </button>
        </div>
      )}
    
    </div>
  );
};
export default RoomScan;
