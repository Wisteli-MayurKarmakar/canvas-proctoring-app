import React, { useEffect } from "react";

interface Props {
  studentId: any;
  courseId: any;
  closeStream: any;
}

const ImageMatchAuthentication: React.FC<Props> = (props): JSX.Element => {
  let [studentPicture, setStudentPicture] = React.useState<any>(null);
  let [fetching, setFetching] = React.useState<boolean>(false);
  let videoRef: any = React.createRef<any>();
  let canvasRef: any = React.createRef<any>();
  let vStream: any = null;

  const startVideo = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          vStream = stream;
          videoRef.current.srcObject = stream;

          let context = canvasRef.current.getContext("2d");
          context.drawImage(videoRef.current, 0, 0, 100, 100);
          let data = canvasRef.current.toDataURL("image/png");
        });
    }
  };

  useEffect(() => {
    startVideo();
  }, []);

  return (
    <div className="flex flex-col gap-10 h-full items-center justify-center">
      {!fetching ? (
        <>
          <div className="flex flex-row gap-10 h-full w-full items-center justify-center">
            <canvas className="w-full h-full hidden" ref={canvasRef} />
            <video
              ref={videoRef}
              playsInline
              autoPlay
              className="w-60 h-60 bg-black rounded"
            ></video>
            <div className="box-border w-60 h-60 border-2 border-gray-600 rounded">
              {studentPicture ? (
                <img
                  src={studentPicture || ""}
                  alt="Not found"
                  className="w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xl font-bold">
                  Not Available
                </div>
              )}
            </div>
          </div>
          {!studentPicture && (
            <div className="flex flex-col h-full items-center justify-center">
              <div
                className="bg-blue-100 rounded-lg py-5 px-6 mb-3 text-base text-blue-700 inline-flex items-center w-full"
                role="alert"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="info-circle"
                  className="w-4 h-4 mr-2 fill-current"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"
                  ></path>
                </svg>
                Please upload your picture from Update profile menu. This could
                be needed for quizzes configured with authentication . Thanks
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full text-xl font-bold">
          Please wait...
        </div>
      )}
    </div>
  );
};

export default ImageMatchAuthentication;
