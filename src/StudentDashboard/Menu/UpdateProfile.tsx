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
  let [photoFileName, setPhotoFileName] = React.useState<any>(null);
  let [idFileName, setIdFileName] = React.useState<any>(null);
  let [fetchingProofs, setFetchingProofs] = React.useState<boolean>(false);

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
        setStudentPhotos(null);
        break;
      case "id":
        setStudentId(null);
        break;
      default:
        break;
    }
  };

  const handlePhotoUpload = (e: any) => {
    const file = e.target.files[0];
    let ftype: string = file.type.split("/")[1];
    // if (ftype !== "image/jpeg" && ftype !== "image/jpg") {
    //   message.error("Only jpg/ jpeg files are allowed");
    //   return;
    // }
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
    // if (ftype !== "image/jpeg" && ftype !== "image/jpg") {
    //   message.error("Only jpg/ jpeg files are allowed");
    //   return;
    // }
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
      },
    });

    if (uploadResponse.status === 200) {
      message.success("File uploaded successfully.");
    } else {
      message.error("Something went wrong uploading the file.");
    }
  };

  const handleSave = () => {
    if (!studentPhotos || !studentId) {
      message.error(
        `Please select ${!studentId ? "id proof" : "profile picture"} to save.`
      );
      return;
    }
    if (userDetails.idLtiStudentProfile) {
      uploadProofs(userDetails.idLtiStudentProfile, "proof1");
      uploadProofs(userDetails.idLtiStudentProfile, "proof2");
    } else {
      console.log("No id");
    }
  };

  useEffect(() => {
    if (studentPhotos || studentId) {
      setFetchingProofs(false);
    }
  }, [studentPhotos, studentId]);

  const getStudentProofs = () => {
    setFetchingProofs(true);
    axios
      .get(
        `https://examd-dev.uc.r.appspot.com/student/api/v1/viewCanvasProfile/${props.guid}/${props.userId}`,
        {
          headers: {
            Authorization: `Bearer ${props.authToken}`,
          },
          responseType: "arraybuffer",
        }
      )
      .then((resp: any) => {
        if (resp.status === 200) {
          let blob = new Blob([resp.data], {
            type: resp.headers["content-type"],
          });
          setStudentPhotos(URL.createObjectURL(blob));
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
    axios
      .get(
        `https://examd-dev.uc.r.appspot.com/student/api/v1/downloadDL/${props.guid}/${props.userId}`,
        {
          headers: {
            Authorization: `Bearer ${props.authToken}`,
          },
          responseType: "arraybuffer",
        }
      )
      .then((resp: any) => {
        if (resp.status === 200) {
          let blob = new Blob([resp.data], {
            type: resp.headers["content-type"],
          });
          setStudentId(URL.createObjectURL(blob));
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
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
        <Button key="save" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      {userDetails && (
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
          {!studentId && (!studentPhotos || !fetchingProofs) && (
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
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
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
                  <div className="flex space-x-2 justify-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia("picture")}
                      className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
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
                  <div className="flex space-x-2 justify-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia("id")}
                      className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Delete
                    </button>
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
      )}
    </Modal>
  );
};

export default UpdateProfile;
