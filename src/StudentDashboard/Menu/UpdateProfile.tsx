import { Button, message, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUserDetails } from "../../APIs/apiservices";

interface Props {
  show: boolean;
  close: any;
  authToken: string;
  guid: string;
  userId: string;
}

const UpdateProfile: React.FC<Props> = (props): JSX.Element => {
  let [userDetails, setUserDetails] = React.useState<any>(null);
  let [studentPhotos, setStudentPhotos] = React.useState<any>(null);
  let [studentId, setStudentId] = React.useState<any>(null);
  let [studPhotoFile, setStudentPhotoFile] = React.useState<any>(null);
  let [stuIdFile, setStuIdFile] = React.useState<any>(null);
  let [verificationStarted, setVerificationStarted] =
    React.useState<boolean>(false);
  let [verificationFailed, setVerificationFailed] =
    React.useState<boolean>(false);
  let [photoBlob, setPhotoBlob] = React.useState<any>(null);
  let [idBlob, setIdBlob] = React.useState<any>(null);
  let [photoFileName, setPhotoFileName] = React.useState<any>(null);
  let [idFileName, setIdFileName] = React.useState<any>(null);
  let [fetchingProofs, setFetchingProofs] = React.useState<boolean>(false);
  let [localProfilPic, setLocalProfilPic] = React.useState<boolean>(false);
  let [localIdPic, setLocalIdPic] = React.useState<boolean>(false);
  let canvasRef: any = React.useRef<any>();
  let videoRef: any = React.useRef<any>();
  let imgWidth: number = 0;
  let imgHeight: number = 0;

  const getUserProfileDetails = () => {
    axios
      .post(
        `https://examd.us/student/api/v1/getLtiStudentProfileDetails/${props.guid}/${props.userId}`,
        {
          headers: {
            Authorization: `Bearer ${props.authToken}`,
          },
        }
      )
      .then((resp) => {
        setUserDetails(resp.data);
      })
      .catch((error) => {
        message.error("Unable to retrieve user details");
      });
  };

  const handleDeleteMedia = (mediaType: string) => {
    switch (mediaType) {
      case "picture":
        setLocalProfilPic(false);
        setStudentPhotos(null);
        break;
      case "id":
        setLocalIdPic(false);
        setStudentId(null);
        break;
      default:
        break;
    }
  };

  // const delay = (seconds: number): Promise<void> => {
  //   return new Promise((resolve) => {
  //     setTimeout(resolve, seconds * 1000);
  //   });
  // };

  // const retry = async <T extends () => Promise<any>>(
  //   f: T,
  //   maxRetry: number,
  //   delayBetweenRetries: number,
  //   timeout: number
  // ): Promise<boolean> => {
  //   return new Promise<boolean>((resolve, reject) => {
  //     (async () => {
  //       for (let i = 0; i < maxRetry; i++) {
  //         try {
  //           await f();
  //           resolve(true);
  //           return;
  //         } catch (e) {}
  //         await delay(delayBetweenRetries);
  //       }
  //       reject("failed to connect to");
  //     })();
  //   });
  // };

  // const doAIVerification = async (
  //   file: any,
  //   verType: string
  // ): Promise<boolean> => {
  //   let formData = new FormData();
  //   formData.append(
  //     "images",
  //     file,
  //     props.userId + verType === "picture" ? "pic.jpg" : "dl.jpg"
  //   );

  //   if (verType === "picture") {
  //     formData.append("imaget", stuIdFile, props.userId + "2.jpg");
  //   } else {
  //     formData.append("imaget", studPhotoFile, props.userId + "2.jpg");
  //   }
  //   formData.append("name", props.userId);

  //   let response = await axios.post(
  //     `https://examd.us/ai/frame/match`,
  //     formData,
  //     {
  //       headers: {
  //         Accept: "*/*",
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Basic ${btoa("TIxApZe7MCosW6:pU1URzjGkY8QVC")}`,
  //       },
  //     }
  //   );
  //   if (response.data.data) {
  //     return true;
  //   }
  //   return false;
  // };

  // function convertBase64toBlob(
  //   b64Data: string,
  //   contentType = "",
  //   sliceSize = 512
  // ) {
  //   const byteCharacters = atob(b64Data);
  //   const byteArrays = [];
  //   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
  //     const slice = byteCharacters.slice(offset, offset + sliceSize);
  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }
  //   const blob = new Blob(byteArrays, { type: contentType });
  //   return blob;
  // }

  // const takeSnapshot = async () => {
  //   let stream = await navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true,
  //   });

  //   if (videoRef.current && stream) {
  //     videoRef.current.srcObject = stream;
  //   }

  //   videoRef.current.srcObject = stream;

  //   imgHeight =
  //     videoRef.current.videoHeight / (videoRef.current.videoWidth / imgWidth);

  //   if (isNaN(imgHeight)) {
  //     imgHeight = imgWidth / (4 / 3);
  //   }

  //   videoRef.current.height = imgHeight;
  //   videoRef.current.width = imgWidth;
  //   canvasRef.current.height = imgHeight;
  //   canvasRef.current.width = imgWidth;

  //   if (!canvasRef.current) return "";
  //   let context = canvasRef.current.getContext("2d");
  //   context.drawImage(videoRef.current, 0, 0, imgWidth, imgHeight);
  //   let data = canvasRef.current.toDataURL("image/jpg");
  //   let b64: string = data.split(";")[1].split(",")[1];
  //   let snapshotBlob = convertBase64toBlob(b64, "image/jpg");
  //   return snapshotBlob;
  // };

  const handlePhotoUpload = async (e: any) => {
    const file = e.target.files[0];
    let ftype: string = file.type.split("/")[1];
    // setVerificationStarted(true);

    // if (stuIdFile) {
    //   let res: boolean = await doAIVerification(file, "picture");
    //   setVerificationStarted(false);

    //   if (!res) {
    //     setVerificationFailed(true);
    //     message.error("Verification failed. Please try again");
    //     return;
    //   }
    // } else {
    //   let snapshot: any = takeSnapshot();
    //   try {
    //     let response = await retry(
    //       async () => {
    //         let resPic = await doAIVerification(snapshot, "picture");
    //         if (resPic) {
    //           return true;
    //         } else {
    //           throw new Error("failed to validate");
    //         }
    //       },
    //       3,
    //       1,
    //       30
    //     );

    //     if (response) {
    //       setVerificationStarted(false);
    //     }
    //   } catch (e) {
    //     setVerificationStarted(false);
    //     setVerificationFailed(true);
    //     message.error("Verification failed. Please try again");
    //     return;
    //   }
    // }

    console.log(`Uploading file ${file.type}`);
    if (ftype !== "jpeg" && ftype !== "png" && ftype !== "jpg") {
      message.error("Only jpg or png files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024 * 1024) {
      message.error("File size is more than 5mb");
      return;
    }
    setLocalProfilPic(true);
    setPhotoFileName(props.userId + "prfl" + `.${ftype}`);
    setStudentPhotoFile(file);

    const reader: any = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      const base64 = reader.result.toString();
      setStudentPhotos(base64);
    };
  };

  const handleIdUpload = (e: any) => {
    const file = e.target.files[0];
    let ftype: string = file.type.split("/")[1];

    if (ftype !== "jpeg" && ftype !== "png" && ftype !== "jpg") {
      message.error("Only jpg or png files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024 * 1024) {
      message.error("File size is more than 5mb");
      return;
    }
    setLocalIdPic(true);
    setIdFileName(props.userId + "dl" + `.${ftype}`);
    setStuIdFile(file);

    const reader: any = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      const base64 = reader.result.toString();

      setStudentId(base64);
    };
  };

  const uploadProofs = async (stuRef: string, proofType: string) => {
    let formData = new FormData();

    switch (proofType) {
      case "proof1":
        formData.append("file", studPhotoFile);
        formData.append("name", photoFileName);
        break;
      case "proof2":
        formData.append("file", stuIdFile);
        formData.append("name", idFileName);
        break;
      default:
        break;
    }

    let uploadUrl = `https://examd-dev.uc.r.appspot.com/student/api/v1/uploadCanvasProfile/${props.guid}/${props.userId}`;

    if (proofType === "proof2") {
      uploadUrl = `https://examd-dev.uc.r.appspot.com/student/api/v1/uploadCanvasDL/${props.guid}/${props.userId}`;
    }

    let uploadResponse: any = await axios.post(uploadUrl, formData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${props.authToken}`,
        "Content-Disposition": `form-data; name=file; filename=${
          proofType === "proof1" ? photoFileName : idFileName
        }`,
      },
    });

    if (uploadResponse.status === 200) {
      if (proofType === "proof1") {
        setLocalProfilPic(false);
      } else {
        setLocalIdPic(false);
      }
      message.success("File uploaded successfully.");
    } else {
      message.error("Something went wrong uploading the file.");
    }
  };

  const handleSave = (uploadType: string) => {
    if (uploadType === "picture") {
      if (!studentPhotos) {
        message.error("Please select a student photo to save.");
        return;
      } else {
        if (userDetails.idLtiStudentProfile) {
          uploadProofs(userDetails.idLtiStudentProfile, "proof1");
        } else {
          message.error("Something went wrong when saving profile picture.");
          return;
        }
      }
    }

    if (uploadType === "id") {
      if (!studentId) {
        message.error("Please select a student id save.");
        return;
      } else {
        if (userDetails.idLtiStudentProfile) {
          uploadProofs(userDetails.idLtiStudentProfile, "proof2");
        } else {
          message.error("Something went wrong when saving id.");
          return;
        }
      }
    }
  };

  const getStudentProofs = async () => {
    setFetchingProofs(true);
    let picFlag: boolean = false;
    let idFlag: boolean = false;
    let picProof = await axios.get(
      `https://examd-dev.uc.r.appspot.com/student/api/v1/viewCanvasProfile/${props.guid}/${props.userId}`,
      {
        headers: {
          Authorization: `Bearer ${props.authToken}`,
        },
        responseType: "arraybuffer",
      }
    );
    if (
      picProof.headers["content-type"] === "image/jpeg" ||
      picProof.headers["content-type"] === "image/png" ||
      picProof.headers["content-type"] === "image/svg" ||
      picProof.headers["content-type"] === "image/webp" ||
      picProof.headers["content-type"] === "image/jpg"
    ) {
      picFlag = true;
      let blob = new Blob([picProof.data], {
        type: picProof.headers["content-type"],
      });
      setPhotoBlob(blob);
      setStudentPhotos(URL.createObjectURL(blob));
    }
    let idProof = await axios.get(
      `https://examd-dev.uc.r.appspot.com/student/api/v1/downloadDL/${props.guid}/${props.userId}`,
      {
        headers: {
          Authorization: `Bearer ${props.authToken}`,
        },
        responseType: "arraybuffer",
      }
    );

    if (
      idProof.headers["content-type"] === "image/jpeg" ||
      idProof.headers["content-type"] === "image/png" ||
      idProof.headers["content-type"] === "image/svg" ||
      idProof.headers["content-type"] === "image/webp" ||
      idProof.headers["content-type"] === "image/jpg"
    ) {
      idFlag = true;
      let blob = new Blob([idProof.data], {
        type: idProof.headers["content-type"],
      });
      setIdBlob(blob);
      setStudentId(URL.createObjectURL(blob));
    }
    setFetchingProofs(false);
  };

  useEffect(() => {
    if (userDetails) {
      getStudentProofs();
    }
  }, [userDetails]);

  useEffect(() => {
    getUserProfileDetails();
  }, []);

  return (
    <Modal
      visible={props.show}
      title="Update Profile"
      onCancel={props.close}
      width={"60pc"}
      maskClosable={false}
      footer={[
        <Button key="close" onClick={props.close}>
          Close
        </Button>,
        // <Button key="save" onClick={handleSave}>
        //   Save
        // </Button>,
      ]}
    >
      <canvas ref={canvasRef} className="hidden"></canvas>
      <video ref={videoRef} className="hidden"></video>
      {userDetails ? (
        <div className="flex flex-col h-full w-full justify-center items-center gap-4">
          <fieldset
            className="h-32 w-full"
            style={{
              border: "1px solid #bec2c7",
              width: "100%",
              borderRadius: "5px",
            }}
          >
            <legend
              className="font-bold"
              style={{
                marginLeft: "1em",
                padding: "0px 11px 0px 12px",
                width: "146px",
                fontSize: "1.2em",
              }}
            >
              Student Details
            </legend>
            <div className="grid grid-cols-3 w-full h-full align-middle">
              <div className="flex flex-row w-full h-full items-center justify-center">
                <p className="text-base font-bold">Student Name:</p>
                <p className="text-base font-semibold">
                  &nbsp;&nbsp;&nbsp;&nbsp;{userDetails.firstName}{" "}
                  {userDetails.lastName}
                </p>
              </div>
              <div className="flex flex-row w-full h-full items-center justify-center">
                <p className="text-base font-bold">Student Id:</p>
                <p className="text-base font-semibold">
                  &nbsp;&nbsp;&nbsp;&nbsp;{userDetails.idUser}
                </p>
              </div>
              <div className="flex flex-row w-full h-full items-center justify-center">
                <p className="text-base font-bold">Institute:</p>
                <p className="text-base font-semibold">
                  &nbsp;&nbsp;&nbsp;&nbsp;{userDetails.guid}
                </p>
              </div>
            </div>
          </fieldset>
          {(!studentId || !studentPhotos) && !fetchingProofs && (
            <div
              className="flex p-2 mb-2 text-sm h-full justify-center text-blue-700 bg-blue-100 rounded-lg"
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
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">Please ensure:</span>
                <ul className="mt-1.5 ml-4 text-blue-700 list-disc list-inside">
                  <li>File size should be 5MB or less</li>
                  <li>File Format should be (.jpg) or (.png)</li>
                </ul>
              </div>
            </div>
          )}
          {!fetchingProofs ? (
            <div className="flex flex-row h-full w-full items-center justify-center gap-14">
              {!studentPhotos ? (
                <div className="flex flex-col w-full h-full items-center justify-center gap-4">
                  <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-blue hover:text-blue-400">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span className="mt-2 text-base font-semibold leading-normal">
                      Select picture
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                  <div
                    className="flex p-2 mb-2 text-sm h-full justify-center text-blue-700 bg-blue-100 rounded-lg"
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
                    <span className="sr-only">Please Note</span>
                    <div>
                      <span className="font-medium">Please Note:</span>
                      <ul className="mt-1.5 ml-4 text-blue-700 list-disc list-inside">
                        <li>The photograph must not be older than one year</li>
                        <li>
                          Full face of the candidate must be clearly visible.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full w-full gap-4 items-center">
                  <img
                    src={studentPhotos}
                    className="max-w-64 max-h-64 rounded-lg"
                    alt="Unable to show"
                  ></img>
                  <div className="flex flex-row space-x-2 justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia("picture")}
                      className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                    {localProfilPic && (
                      <button
                        type="button"
                        onClick={() => handleSave("picture")}
                        className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              )}
              {!studentId ? (
                <div className="flex flex-col w-full h-full items-center justify-center gap-4">
                  <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-blue hover:text-blue-400">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span className="mt-2 text-base font-semibold leading-normal">
                      Select ID proof
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleIdUpload}
                    />
                  </label>
                  <div
                    className="flex p-2 mb-2 text-sm h-full justify-center text-blue-700 bg-blue-100 rounded-lg"
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
                    <span className="sr-only">Please Note</span>
                    <div>
                      <span className="font-medium">Please Note:</span>
                      <ul className="mt-1.5 ml-4 text-blue-700 list-disc list-inside">
                        <li> ID must not be expired.</li>
                        <li>ID must have the Photo of the candidate.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full w-full gap-4 items-center">
                  <img
                    src={studentId}
                    className="max-w-64 max-h-64 rounded-lg"
                    alt="Unable to show"
                  ></img>
                  <div className="flex flex-row gap-4 space-x-2 justify-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia("id")}
                      className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                    {localIdPic && (
                      <button
                        type="button"
                        onClick={() => handleSave("id")}
                        className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full w-full justify-center items-center">
              Please wait...
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full w-full text-lg font-semibold items-center justify-center">
          Fetching user details. Please wait...
        </div>
      )}
    </Modal>
  );
};

export default UpdateProfile;
