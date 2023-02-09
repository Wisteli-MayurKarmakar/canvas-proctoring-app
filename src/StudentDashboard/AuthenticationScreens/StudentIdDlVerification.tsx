import { message } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useWebCamStore } from "../../store/globalStore";
import {
  aiMatch,
  viewCanvasProfile,
  downloadDL,
  getLtiStudentProfileDetails,
} from "../../apiConfigs";

interface Props {
  authConfigs: any;
  authToken: any;
  userId: string;
  guid: string;
  studentId: string;
  handleAuth: (status: boolean) => void;
}

const StudentIdDlVerification: React.FC<Props> = (props): JSX.Element => {
  let [studentPhoto, setStudentPhoto] = React.useState<any>(null);
  let [studentId, setStudentId] = React.useState<any>(null);
  let [isPhotoAvailable, setIsPhotoAvailable] = React.useState<boolean>(false);
  let [retryInProgress, setRetryInProgress] = React.useState<boolean>(true);
  let [pictureBlob, setPictureBlob] = React.useState<Blob | null>(null);
  let [idProofBlob, setIdProofBlob] = React.useState<Blob | null>(null);
  let [pictureAuthed, setPictureAuthed] = React.useState<boolean>(false);
  let [idAuthed, setIdAuthed] = React.useState<boolean>(false);
  let [showProfilePicAlert, setShowProfilePicAlert] =
    React.useState<boolean>(false);
  let [showIdPicAlert, setShowIdPicAlert] = React.useState<boolean>(false);
  let [studentAuthed, setStudentAuthed] = React.useState<boolean>(false);
  let [authStarted, setAuthStarted] = React.useState<boolean>(false);
  // let [snapshotBlob, setSnapshotBlob] = React.useState<Blob | string>("");
  let [retryCount, setRetryCount] = React.useState<number>(0);
  let [isRetry, setIsRetry] = React.useState<boolean>(false);
  let [stream, setStream] = React.useState<MediaStream>();
  let setStreamInStore = useWebCamStore((state) => state.setStream);
  let vidSrcRef: any = React.useRef<any>();
  let canvasRef: any = React.useRef<any>();
  const imgWidth: number = 320;
  let imgHeight: number = 0;

  // let idApproved: boolean = false;

  // const getUserProfileDetails = () => {
  //   axios
  //     .post(`${getLtiStudentProfileDetails}${props.guid}/${props.userId}`, {
  //       headers: {
  //         Authorization: `Bearer ${props.authToken}`,
  //       },
  //     })
  //     .then((resp) => {
  //       const approved: boolean =
  //         resp.data.idApprovalStatus === 0 ? false : true;
  //       idApproved = approved;
  //     })
  //     .catch((error) => {
  //       message.error("Unable to retrieve user details");
  //     });
  // };

  // getUserProfileDetails();

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

  const getSnapshot = () => {
    if (!canvasRef.current) return "";
    let context = canvasRef.current.getContext("2d");
    context.drawImage(vidSrcRef.current, 0, 0, imgWidth, imgHeight);
    let data = canvasRef.current.toDataURL("image/jpg");
    let b64: string = data.split(";")[1].split(",")[1];
    let snapshotBlob = convertBase64toBlob(b64, "image/jpg");
    return snapshotBlob;
  };

  const doAiAuth = async (
    proofBlob: Blob,
    authType: string
  ): Promise<boolean> => {
    let snapshotBlob = getSnapshot();
    if (snapshotBlob === "") {
      return false;
    }
    let formData = new FormData();
    formData.append(
      "images",
      proofBlob,
      props.studentId + authType === "picture" ? "pic.jpg" : "dl.jpg"
    );
    formData.append("imaget", snapshotBlob, props.studentId + "2.jpg");
    formData.append("name", props.studentId);
    let response = await axios.post(`${aiMatch}`, formData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
        Authorization: `Basic ${btoa("TIxApZe7MCosW6:pU1URzjGkY8QVC")}`,
      },
    });
    if (response.data.data) {
      setPictureAuthed(true);
      return true;
    }
    return false;
  };

  const delay = (seconds: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000);
    });
  };

  const retry = async <T extends () => Promise<any>>(
    f: T,
    maxRetry: number,
    delayBetweenRetries: number
  ): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      (async () => {
        for (let i = 0; i < maxRetry; i++) {
          try {
            await f();
            resolve(true);
            return;
          } catch (e) {}
          await delay(delayBetweenRetries);
        }
        reject("failed to connect to");
      })();
    });
  };

  const startVideo = async () => {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (vidSrcRef.current && stream) {
      vidSrcRef.current.srcObject = stream;
      setStreamInStore(stream);
      setStream(stream);
    }

    vidSrcRef.current.srcObject = stream;
    imgHeight =
      vidSrcRef.current.videoHeight / (vidSrcRef.current.videoWidth / imgWidth);

    if (isNaN(imgHeight)) {
      imgHeight = imgWidth / (4 / 3);
    }

    vidSrcRef.current.height = imgHeight;
    vidSrcRef.current.width = imgWidth;
    canvasRef.current.height = imgHeight;
    canvasRef.current.width = imgWidth;
    setAuthStarted(true);

    let awaitPictureRes = null;
    let awaitIdRes = null;

    try {
      if (props.authConfigs.studentPicture) {
        awaitPictureRes = await retry(
          async () => {
            if (!pictureBlob) {
              return false;
            }
            let resPic = await doAiAuth(pictureBlob, "picture");
            if (resPic) {
              setPictureAuthed(true);
              return true;
            } else {
              throw new Error("failed to validate");
            }
          },
          3,
          1
        );
      }

      if (props.authConfigs.studentIdDl) {
        awaitIdRes = await retry(
          async () => {
            if (!idProofBlob) {
              return false;
            }
            let resId = await doAiAuth(idProofBlob, "id");
            if (resId) {
              setIdAuthed(true);
              return true;
            } else {
              throw new Error("failed to validate");
            }
          },
          3,
          1
        );
      }

      let [resPic, resId] = await Promise.all([awaitPictureRes, awaitIdRes]);

      let pictureAuth = props.authConfigs.studentPicture;
      let idAuth = props.authConfigs.studentIdDl;

      if (pictureAuth && idAuth) {
        if (resPic && resId) {
          if (awaitPictureRes && awaitIdRes) {
            setStudentAuthed(true);
          } else {
            setStudentAuthed(false);
          }
        } else {
          setStudentAuthed(false);
        }
        setAuthStarted(false);
      }

      if (pictureAuth && !idAuth) {
        if (resPic) {
          if (awaitPictureRes) {
            setStudentAuthed(true);
          }
        } else {
          setStudentAuthed(false);
        }
        setAuthStarted(false);
      }

      if (!pictureAuth && idAuth) {
        if (resId) {
          if (awaitIdRes) {
            setStudentAuthed(true);
          }
        } else {
          setStudentAuthed(false);
        }
        setAuthStarted(false);
      }

      stream.getTracks().forEach((track: any) => track.stop());
      setRetryInProgress(false);
      setIsRetry(false);
    } catch (e) {
      setAuthStarted(false);
      setStudentAuthed(false);
      setIsRetry(false);
      stream.getTracks().forEach((track: any) => track.stop());
      setRetryInProgress(false);
    }
  };

  useEffect(() => {
    if (studentAuthed) {
      props.handleAuth(true);
    }
  }, [studentAuthed]);

  const getStudentProofs = async () => {
    if (props.authConfigs.studentPicture) {
      let responsePicture = await axios.get(
        `${viewCanvasProfile}${props.guid}/${props.studentId}`,
        {
          headers: {
            Authorization: `Bearer ${props.authToken}`,
          },
          responseType: "arraybuffer",
        }
      );
      if (
        responsePicture.headers["content-type"] === "application/json" ||
        responsePicture.headers["content-type"] === "text/plain" ||
        responsePicture.headers["content-type"] === "text/html"
      ) {
        setShowProfilePicAlert(true);
        return;
      }
      let blobPricture = new Blob([responsePicture.data], {
        type: responsePicture.headers["content-type"],
      });
      setPictureBlob(blobPricture);
      setStudentPhoto(URL.createObjectURL(blobPricture));
    }

    if (props.authConfigs.studentIdDl) {
      let responseId = await axios.get(
        `${downloadDL}${props.guid}/${props.studentId}`,
        {
          headers: {
            Authorization: `Bearer ${props.authToken}`,
          },
          responseType: "arraybuffer",
        }
      );
      if (
        responseId.headers["content-type"] === "application/json" ||
        responseId.headers["content-type"] === "text/plain" ||
        responseId.headers["content-type"] === "text/html"
      ) {
        setShowIdPicAlert(true);
        return;
      }
      let blobId = new Blob([responseId.data], {
        type: responseId.headers["content-type"],
      });
      setIdProofBlob(blobId);
      setStudentId(URL.createObjectURL(blobId));
    }
  };

  useEffect(() => {
    let pictureAuth = props.authConfigs.studentPicture;
    let idAuth = props.authConfigs.studentIdDl;

    if (pictureAuth && idAuth) {
      if (studentPhoto && studentId) {
        setRetryInProgress(true);
        startVideo();
      }
    }

    if (pictureAuth && !idAuth) {
      if (studentPhoto) {
        setRetryInProgress(true);
        startVideo();
      }
    }

    if (!pictureAuth && idAuth) {
      if (studentId) {
        setRetryInProgress(true);
        startVideo();
      }
    }
  }, [studentPhoto, studentId]);

  useEffect(() => {
    if (isRetry) {
      setPictureAuthed(false);
      setIdAuthed(false);
      setRetryInProgress(true);
      startVideo();
    }
  }, [isRetry]);

  const handleRetry = () => {
    if (retryCount > 2) {
      message.error("You have reached the maximum number of retries.");
      return;
    }
    setIsRetry(true);
    setRetryCount((prevCount: number) => prevCount + 1);
  };

  useEffect(() => {
    getStudentProofs();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track: any) => track.stop());
      }
    };
  }, []);

  // if (!idApproved) {
  //   return (
  //     <div className="flex items-center justify-center">
  //       <p className="text-lg text-center font-semibold">
  //         Instructor had denied you Id approval status and you can't proceed
  //         further with authentication.
  //       </p>
  //       <p className="text-lg text-center font-semibold">
  //         Please contact the instructor.
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="flex flex-row gap-10 h-full justify-center">
        <canvas ref={canvasRef} className="w-full h-full hidden" />
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
              ) : !isPhotoAvailable ? (
                <div className="flex items-center justify-center w-full h-full text-xl font-bold">
                  <p>Not available</p>
                </div>
              ) : (
                <div className="flex flex-row w-full h-full items-center justify-center">
                  Fetching profile picture
                </div>
              )}
            </div>
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
            <p className="text-center text-xl font-bold">Student DL/ ID</p>
          </div>
        )}
      </div>
      {authStarted && (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-lg font-bold">
            Authentication in progress. Please wait ...
          </p>
        </div>
      )}
      {showProfilePicAlert && (
        <div
          className="flex p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800"
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
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">No Profile picture available!</span>{" "}
            Please upload a profile picture and try again.
          </div>
        </div>
      )}
      {showIdPicAlert && (
        <div
          className="flex p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800"
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
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">No Id available!</span> Please upload
            an Id and try again.
          </div>
        </div>
      )}
      {!retryInProgress &&
        (studentAuthed ? (
          <div className="flex h-full justify-center w-full items-center">
            <p className="text-lg text-green-500 font-bold">Congratulations,</p>
            <p className="text-lg font-bold">&nbsp;you are authenticated.</p>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full items-center justify-center">
            <div className="flex flex-row justify-center h-full w-full">
              <p className="text-lg text-red-500 font-bold">
                Authentication failed.
              </p>
            </div>
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
            {retryCount < 3 ? (
              <div className="flex space-x-2 gap-4 w-full items-center justify-center">
                <p className="text-lg font-semibold">
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
            ) : (
              <p className="text-center text-lg font-semibold">
                You have reached the maximum number of allowed retires.
              </p>
            )}
          </div>
        ))}
    </>
  );
};
export default StudentIdDlVerification;
