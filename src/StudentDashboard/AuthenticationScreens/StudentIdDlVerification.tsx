import React, { useEffect } from "react";

interface Props {
  authConfigs: any;
}

const StudentIdDlVerification: React.FC<Props> = (props): JSX.Element => {
  let [studentPhoto, setStudentPhoto] = React.useState<any>(null);
  let [studentId, setStudentId] = React.useState<any>(null);
  let vidSrcRef = React.useRef<any>(null);
  let canvasRef = React.useRef<any>(null);
  const imgWidth: number = 320;
  let imgHeight: number = 0;

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream: any) => {
      vidSrcRef.current.srcObject = stream;
      imgHeight =
        vidSrcRef.current.videoHeight /
        (vidSrcRef.current.videoWidth / imgWidth);

      if (isNaN(imgHeight)) {
        imgHeight = imgWidth / (4 / 3);
      }

      vidSrcRef.current.height = imgHeight;
      vidSrcRef.current.width = imgWidth;

      canvasRef.current.height = imgHeight;
      canvasRef.current.width = imgWidth;
    });
  };

  const handleTakePhoto = () => {
    if (!canvasRef.current) {
      return;
    }
    const context = canvasRef.current.getContext("2d");
    if (context) {
      context.drawImage(vidSrcRef.current, 0, 0, imgWidth, imgHeight);
      const data = canvasRef.current.toDataURL("image/png");
      setStudentPhoto(data);
    }
  };

  const handleTakeId = () => {
    if (!studentPhoto) {
      alert("Please take photo first");
      return;
    }
    if (!canvasRef.current) {
      return;
    }
    const context = canvasRef.current.getContext("2d");
    if (context) {
      context.drawImage(
        vidSrcRef.current,
        0,
        imgHeight - imgHeight / 2,
        imgWidth,
        imgHeight / 2
      );
      const data = canvasRef.current.toDataURL("image/png");
      setStudentId(data);
    }
  };

  useEffect(() => {
    startVideo();
  }, []);

  return (
    <>
      <div className="flex flex-row gap-10">
        <canvas
          ref={canvasRef}
          width={imgWidth}
          height={imgHeight}
          className="hidden"
        />
        <div className="box-border h-56 w-64 p-1 border-2 rounded">
          <video
            ref={vidSrcRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full"
          />
        </div>
        {props.authConfigs.studentPicture && (
          <div className="flex flex-col">
            <div className="box-border h-56 w-64 p-1 border-2 rounded">
              {studentPhoto ? (
                <img
                  src={studentPhoto}
                  alt="Not found"
                  className="w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xl font-bold">
                  <p>Not available</p>
                </div>
              )}
            </div>
            {!studentPhoto && (
              <div className="flex space-x-2 justify-center mt-5 mb-5">
                <button
                  onClick={handleTakePhoto}
                  type="button"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Save picture
                </button>
              </div>
            )}
            <p className="text-center text-xl font-bold">Student Picture</p>
          </div>
        )}
        {props.authConfigs.studentIdDl && (
          <div className="flex flex-col">
            <div className="box-border h-56 w-64 p-1 border-2 rounded">
              {studentId ? (
                <img
                  src={studentId}
                  alt="Not found"
                  className="w-full object-fill h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xl font-bold">
                  <p>Not available</p>
                </div>
              )}
            </div>
            {!studentId && (
              <div className="flex space-x-2 justify-center mt-5 mb-5">
                <button
                  onClick={handleTakeId}
                  type="button"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Save id/ dl
                </button>
              </div>
            )}
            <p className="text-center text-xl font-bold">Student DL/ ID</p>
          </div>
        )}
      </div>
      {(!studentId || !studentPhoto) && (
        <div
          className="bg-blue-100 rounded-lg py-1 px-3 text-base text-blue-700 inline-flex flex-col items-center w-full h-full justify-center"
          role="alert"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="info-circle"
            className="w-8 h-8 mr-2 fill-current"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"
            ></path>
          </svg>
          <ul>
            {!studentPhoto && (
              <li>
                <p>
                  <strong>
                    Please press the "Save picture" button to save a new
                    picture.
                  </strong>
                </p>
              </li>
            )}
            {!studentId && (
              <li>
                <p>
                  <strong>
                    Please press the "Save id/ dl" button to save a new id/ dl.
                  </strong>
                </p>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
};
export default StudentIdDlVerification;
