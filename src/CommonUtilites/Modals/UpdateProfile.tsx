import { Button, message, Modal } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import {
  uploadCanvasDL,
  uploadCanvasProfile,
  viewCanvasProfile,
  downloadDL,
  getLtiStudentProfileDetails,
  saveLtiStudentProfile,
} from "../../apiConfigs";
import { useAppStore } from "../../store/AppSotre";
import WaitingModal from "../WaitingModal";

interface Props {
  show: boolean;
  close: any;
  authToken: string;
  guid: string;
  userId: string;
  title: string;
}

const UpdateProfile: React.FC<Props> = (props): JSX.Element => {
  let [userDetails, setUserDetails] = React.useState<any>(null);
  let [studentPhotos, setStudentPhotos] = React.useState<any>(null);
  let [studentId, setStudentId] = React.useState<any>(null);
  let [studPhotoFile, setStudentPhotoFile] = React.useState<any>(null);
  let [stuIdFile, setStuIdFile] = React.useState<any>(null);
  let [photoBlob, setPhotoBlob] = React.useState<any>(null);
  let [idBlob, setIdBlob] = React.useState<any>(null);
  let [photoFileName, setPhotoFileName] = React.useState<any>(null);
  let [idFileName, setIdFileName] = React.useState<any>(null);
  let [fetchingProofs, setFetchingProofs] = React.useState<boolean>(false);
  let [localProfilPic, setLocalProfilPic] = React.useState<boolean>(false);
  let [localIdPic, setLocalIdPic] = React.useState<boolean>(false);
  const [updatingProfile, setUpdatingProfile] = React.useState<boolean>(false);
  const [approved, setApproved] = React.useState<boolean | null>(null);
  let canvasRef: any = React.useRef<any>();
  let videoRef: any = React.useRef<any>();
  const { tokenData } = useAppStore((state) => state);

  const updatingProfileMsg: JSX.Element = (
    <p className="text-center text-lg font-semibold">
      Updating profile. Please wait...
    </p>
  );

  const getUserProfileDetails = () => {
    axios
      .post(`${getLtiStudentProfileDetails}${props.guid}/${props.userId}`, {
        headers: {
          Authorization: `Bearer ${props.authToken}`,
        },
      })
      .then((resp) => {
        setUserDetails(resp.data);
        const approved: boolean =
          resp.data.idApprovalStatus === 0 ? false : true;
        setApproved(resp.data.idApprovalStatus);
      })
      .catch((error) => {
        props.close();
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

  const handlePhotoUpload = async (e: any) => {
    const file = e.target.files[0];
    let ftype: string = file.type.split("/")[1];

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

    let uploadUrl = `${uploadCanvasProfile}${props.guid}/${props.userId}`;

    if (proofType === "proof2") {
      uploadUrl = `${uploadCanvasDL}${props.guid}/${props.userId}`;
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
    try {
      let picFlag: boolean = false;
      let idFlag: boolean = false;

      let picResponse = await axios.get(
        `${viewCanvasProfile}${props.guid}/${props.userId}`,
        {
          headers: {
            Authorization: `Bearer ${props.authToken}`,
          },
          responseType: "arraybuffer",
        }
      );

      if (
        picResponse.headers["content-type"] === "image/jpeg" ||
        picResponse.headers["content-type"] === "image/png" ||
        picResponse.headers["content-type"] === "image/svg" ||
        picResponse.headers["content-type"] === "image/webp" ||
        picResponse.headers["content-type"] === "image/jpg"
      ) {
        picFlag = true;
        let blob = new Blob([picResponse.data], {
          type: picResponse.headers["content-type"],
        });
        setPhotoBlob(blob);
        setStudentPhotos(URL.createObjectURL(blob));
      }

      let dlResponse = await axios.get(
        `${downloadDL}${props.guid}/${props.userId}`,
        {
          headers: {
            Authorization: `Bearer ${props.authToken}`,
          },
          responseType: "arraybuffer",
        }
      );

      if (
        dlResponse.headers["content-type"] === "image/jpeg" ||
        dlResponse.headers["content-type"] === "image/png" ||
        dlResponse.headers["content-type"] === "image/svg" ||
        dlResponse.headers["content-type"] === "image/webp" ||
        dlResponse.headers["content-type"] === "image/jpg"
      ) {
        idFlag = true;
        let blob = new Blob([dlResponse.data], {
          type: dlResponse.headers["content-type"],
        });
        setIdBlob(blob);
        setStudentId(URL.createObjectURL(blob));
      }
      setFetchingProofs(false);
    } catch (err) {
      setFetchingProofs(false);
    }
  };

  useEffect(() => {
    if (userDetails) {
      getStudentProofs();
    }
  }, [userDetails]);

  useEffect(() => {
    getUserProfileDetails();
  }, []);

  let title: string | null = null;

  if (props.title === "updateId") {
    title = "Update Profile";
  } else {
    title = "Id Approval";
  }

  const handleIdApproval = (flag: boolean, approvalType: string) => {
    let profileDetails = { ...userDetails };
    profileDetails.idApprovalStatus = flag ? 1 : 0;
    setApproved(flag);
    setUpdatingProfile(true);
    axios
      .post(`${saveLtiStudentProfile}/${tokenData.instituteId}`, [
        { ...profileDetails },
      ])
      .then((resp: any) => {
        let statusText: string = "Student's id profile is approved";
        if (approvalType === "denied") {
          statusText = "Student's id profile is denied";
        }
        message.success(statusText);
        setUpdatingProfile(false);
      })
      .catch((err) => {
        setUpdatingProfile(false);
        message.error("Error updating profile");
      });
  };

  return (
    <Modal
      visible={props.show}
      title={title}
      onCancel={props.close}
      width={"60pc"}
      maskClosable={false}
      footer={[
        <Button
          key="close"
          onClick={props.close}
          type="primary"
          className="!bg-blue-600 !rounded"
        >
          Close
        </Button>,
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
            <>
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
                          <li>
                            The photograph must not be older than one year
                          </li>
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
                      {props.title !== "idApproval" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia("picture")}
                          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                        >
                          Update
                        </button>
                      )}
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
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
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
                      {props.title !== "idApproval" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia("id")}
                          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                        >
                          Update
                        </button>
                      )}
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
              <div className="flex flex-row h-full items-center gap-16">
                <div className="form-check">
                  <input
                    className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="checkbox"
                    id="flexCheckDefault"
                    disabled={props.title === "idApproval" ? false : true}
                    checked={!approved ? true : false}
                    onChange={() => handleIdApproval(false, "denied")}
                  />
                  <label
                    className="form-check-label inline-block text-gray-800"
                    htmlFor="flexCheckDefault"
                  >
                    Id Denied
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="checkbox"
                    id="flexCheckChecked"
                    disabled={props.title === "idApproval" ? false : true}
                    checked={approved ? true : false}
                    onChange={() => handleIdApproval(true, "approved")}
                  />
                  <label
                    className="form-check-label inline-block text-gray-800"
                    htmlFor="flexCheckChecked"
                  >
                    Id Approved
                  </label>
                </div>
              </div>
              {updatingProfile && (
                <WaitingModal
                  visible={updatingProfile}
                  title="Updating Profile"
                  message={updatingProfileMsg}
                />
              )}
            </>
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
