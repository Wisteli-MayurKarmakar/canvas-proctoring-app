import React from "react";

const RoomScan: React.FC = () => {
  let liveCapSource = React.useRef<any>(null);
  let recordedCapSource = React.useRef<any>(null);
  let [isRecording, setIsRecording] = React.useState<any>(false);
  let [recordedMedia, setRecordedMedia] = React.useState<any>(null);
  let [mediaStream, setMediaStream] = React.useState<any>(null);

  const startRecording = async (stream: any) => {
    let recorder = new MediaRecorder(stream);
    let data: any = [];

    recorder.ondataavailable = (event) => data.push(event.data);
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
    }
  };

  const handleRecording = () => {
    if (!isRecording) {
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

  return (
    <div className="flex flex-row items-center justify-center gap-10">
      <div className="flex flex-col">
        <div className="box-border h-56 w-64 p-1 border-2 rounded">
          <video ref={liveCapSource} autoPlay playsInline muted></video>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="box-border h-56 w-64 p-1 border-2 rounded">
          <video ref={recordedCapSource} controls></video>
        </div>
      </div>
      <div className="flex space-x-2 justify-center">
        <button
          onClick={handleRecording}
          type="button"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
    </div>
  );
};
export default RoomScan;
