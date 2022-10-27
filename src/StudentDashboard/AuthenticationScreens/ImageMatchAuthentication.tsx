import { message } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useWebCamStore } from "../../store/globalStore";
import {
  aiMatch,
  viewCanvasProfile,
  getLtiStudentProfileDetails,
} from "../../apiConfigs";

interface Props {
  studentId: any;
  courseId: any;
  closeStream: any;
  authToken: any;
  guid: any;
  openUpdateProfile: (flag: boolean) => void;
}

const ImageMatchAuthentication: React.FC<Props> = (props): JSX.Element => {
  let [studentPicture, setStudentPicture] = React.useState<any>(null);
  let [fetching, setFetching] = React.useState<boolean>(false);
  let [userDetails, setUserDetails] = React.useState<any>(null);
  let [proofBlob, setProofBlob] = React.useState<Blob | null>(null);
  let [retryInProgress, setRetryInProgress] = React.useState<boolean>(true);
  let videoRef: any = React.useRef<any>();
  let canvasRef: any = React.useRef<any>();
  let [authStarted, setAuthStarted] = React.useState<boolean>(false);
  let [waitCompleted, setWaitCompleted] = React.useState<boolean>(false);
  let [studentAuthed, setStudentAuthed] = React.useState<boolean>(false);
  let [retryCount, setRetryCount] = React.useState<number>(0);
  let [isRetry, setIsRetry] = React.useState<boolean>(false);
  const stream = useWebCamStore((state) => state.stream);
  const closeWebCamResouce = useWebCamStore(
    (state) => state.closeWebCamResouce
  );
  const initWebCam = useWebCamStore((state) => state.initWebCam);
  const isWebCamActive = useWebCamStore((state) => state.isWebCamActive);

  function convertBase64toBlob(
    b64Data: string,
    contentType = "",
    sliceSize = 512
  ) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  const doAiMatchValidation = async () => {
    setAuthStarted(true);
    if (!canvasRef.current) {
      return false;
    }
    let context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 100, 100);
    let data = canvasRef.current.toDataURL("image/jpg");
    let b64: string = data.split(";")[1].split(",")[1];
    let snapshotBlob = convertBase64toBlob(b64, "image/jpg");
    let formData = new FormData();
    if (proofBlob) {
      formData.append("images", proofBlob, props.studentId + "_1.jpg");
    }
    formData.append("imaget", snapshotBlob, props.studentId + "_2.jpg");
    formData.append("name", props.studentId);
    let response = await axios.post(`${aiMatch}`, formData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
        Authorization: `Basic ${btoa("TIxApZe7MCosW6:pU1URzjGkY8QVC")}`,
      },
    });

    if (response.data.data) {
      return true;
    }
    return false;
  };

  const delay = (seconds: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000);
    });
  };

  const retry = async <T extends () => Promise<void>>(
    f: T,
    maxRetry: number,
    delayBetweenRetries: number,
    timeout: number
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      let cancel = false;

      (async () => {
        for (let i = 0; i < maxRetry; i++) {
          if (cancel) {
            return;
          }

          try {
            await f();
            console.log("no error on retry" + i);
            // clearTimeout(timeoutId);
            resolve();
            return;
          } catch (e) {
          }
          await delay(delayBetweenRetries);
        }

        // clearTimeout(timeoutId);
        reject("failed to connect to");
      })();
    });
  };

  const startVideo = async () => {
    // let stream = await navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: false,
    // });

    if (stream) {
      videoRef.current.srcObject = stream;
    }

    try {
      setWaitCompleted(false);
      await retry(
        async () => {
          let res = await doAiMatchValidation();
          if (res) {
            return;
          } else {
            throw new Error("failed to validate");
          }
        },
        3,
        1,
        15
      );

      setStudentAuthed(true);
      setWaitCompleted(true);
      setAuthStarted(false);
      // videoRef.current.srcObject.getTracks().forEach((track: any) => {
      //   track.stop();
      // });
      if (isWebCamActive) {
        closeWebCamResouce();
      }

      setRetryInProgress(false);
    } catch (err) {
      setWaitCompleted(true);
      setStudentAuthed(false);
      setAuthStarted(false);
      // videoRef.current.srcObject.getTracks().forEach((track: any) => {
      //   track.stop();
      // });
      if (isWebCamActive) {
        closeWebCamResouce();
      }
      setRetryInProgress(false);
    }
  };

  const getStudentProof = () => {
    setFetching(true);
    axios
      .get(`${viewCanvasProfile}${props.guid}/${props.studentId}`, {
        headers: {
          Authorization: `Bearer ${props.authToken}`,
        },
        responseType: "arraybuffer",
      })
      .then((response: any) => {
        setFetching(false);
        if (response.headers["content-type"] === "application/json") {
          return;
        }
        let blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        setStudentPicture(URL.createObjectURL(blob));
        initWebCam();
        setProofBlob(blob);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const getStudentDetails = () => {
    axios
      .post(`${getLtiStudentProfileDetails}${props.guid}/${props.studentId}`, {
        headers: {
          Authorization: `Bearer ${props.authToken}`,
        },
      })
      .then((resp) => {
        setUserDetails(resp.data);
      })
      .catch((error) => {
        message.error("Unable to retrieve user details");
      });
  };

  useEffect(() => {
    if (studentPicture && stream) {
      setRetryInProgress(true);
      startVideo();
    }
  }, [studentPicture, stream]);

  useEffect(() => {
    if (isRetry) {
      setStudentAuthed(false);
      setWaitCompleted(false);
      setRetryInProgress(true);
      startVideo();
    }
  }, [isRetry]);

  const handleRetry = () => {
    if (retryCount > 3) {
      message.error("You have reached the maximum number of retries.");
      return;
    }
    setIsRetry(true);
    setRetryInProgress(true);
    setRetryCount(retryCount + 1);
  };

  useEffect(() => {
    getStudentDetails();
    getStudentProof();
    return () => {
      closeWebCamResouce();
    }
  }, []);

  return (
    <div className="flex flex-col gap-10 h-full items-center justify-center">
      <div className="flex flex-row gap-10 h-full items-center justify-center">
        <canvas className="w-full h-full hidden" ref={canvasRef} />
        <video
          ref={videoRef}
          playsInline
          autoPlay
          className="w-60 h-60 bg-black rounded"
        ></video>
        <div className="flex flex-col h-full w-full items-center justify-center">
          <div className="box-border w-60 h-60 border-2 border-gray-600 rounded">
            {!fetching ? (
              studentPicture ? (
                <img
                  src={studentPicture}
                  alt="Not found"
                  className="w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xl font-bold">
                  Not Available
                </div>
              )
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xl font-bold">
                Please wait...
              </div>
            )}
          </div>
        </div>
      </div>
      {!studentPicture && !fetching && (
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
            Please upload your picture from Update profile menu. This could be
            needed for quizzes configured with authentication . Thanks
          </div>
          <div className="flex flex-row gap-4 items-center">
            <p className="text-lg font-semibold pt-4">
              Upload profile picture/ id?
            </p>
            <button
              type="button"
              onClick={() => props.openUpdateProfile(true)}
              className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out`}
            >
              Upload
            </button>
          </div>
        </div>
      )}
      {!retryInProgress &&
        (studentAuthed ? (
          <div className="flex flex-row justify-center h-full w-full items-center">
            <p className="text-lg text-green-500 font-bold">Congratulations,</p>
            <p className="text-lg font-bold">
              &nbsp;you are successfully authenticated and are able to take
              quiz. Thanks
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full items-center justify-center">
            <div className="flex h-full w-full justify-center">
              <p className="text-lg text-red-500 font-bold">
                Authentication failed.
              </p>
            </div>
            <div className="flex h-full">
              <div
                className="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                role="alert"
              >
                <svg
                  aria-hidden="true"
                  className="flex-shrink-0 inline w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Danger</span>
                <div>
                  <span className="font-medium">
                    Guidelines for a successful authentication:
                  </span>
                  <ul className="mt-1.5 ml-4 text-red-700 list-disc list-inside">
                    <li>Make sure that your'e facing straight to the camera</li>
                    <li>Proper light conditions</li>
                    <li>
                      Doesn't matches the ID/Picture with accessories like hat,
                      glasses, beard etc.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 gap-4 w-full items-center justify-center">
              <p className="text-lg font-semibold pt-4">
                To try again please click the button.
              </p>
              <button
                type="button"
                onClick={() => handleRetry()}
                className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out`}
              >
                Retry
              </button>
            </div>
          </div>
        ))}

      {authStarted && (
        <div className="flex flex-row h-full w-full items-center justify-center">
          <p className="text-lg  font-bold">
            Authentication in progress. Please wait...
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageMatchAuthentication;
