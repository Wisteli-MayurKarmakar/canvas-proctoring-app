import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  generateOtpForCanvasQuiz,
  validateOtpForCanvasQuiz,
} from "../../apiConfigs";
import emailjs from "@emailjs/browser";

interface Props {
  authToken: string;
  guid: string;
  studentId: string;
  student: any;
  otpVerified: (falg: boolean) => void;
  quizTitle: string;
}

const OtpVerification: React.FC<Props> = (props) => {
  let [reSendOtp, setReSendOtp] = useState<boolean>(false);
  let [otpInput, setOtpInput] = useState<string>("");
  let [verificationStatus, setVerificaitonStatus] = useState<boolean | null>(
    null
  );

  const sendOtpOnMail = (otp: string) => {
    let serviceId: string = "service_2su5kx4";
    let templateId: string = "template_iqbfsp2";
    let pubKey: string = "qaGgmKlvzp5138RXC";
    let messageBody: { [key: string]: string } = {
      subject: `Otp for ${props.quizTitle} Authentication`,
      recipent_name: `${props.student.user.name}`,
      message: `Your Otp (One Time passcode/ password) to authenticate is ${otp}
      `,
      send_to: `${props.student.user.login_id}`,
      reply_to: "devshantanu@gmail.com",
    };
    emailjs
      .send(serviceId, templateId, messageBody, pubKey)
      .then((response) => {
        message.success("Otp sent successfully");
      })
      .catch((error) => {
        message.error("Error sending otp. Please try again");
      });
  };

  const generateOpt: any = async () => {
    let response = await axios.get(
      `${generateOtpForCanvasQuiz}${props.guid}/${props.studentId}`,
      {
        headers: {
          Authorization: `Bearer ${props.authToken}`,
        },
      }
    );

    if (response.data.code === 200) {
      console.log("OTP::", response.data.message);
      // sendOtpOnMail(response.data.message);
    }
  };

  const handleInputChange = (e: any) => {
    setOtpInput(e.target.value);
  };

  const handleResendOTP = () => {
    if (reSendOtp) {
      setReSendOtp(false);
    }
    setOtpInput("");
    setVerificaitonStatus(null);
    generateOpt();
    setReSendOtp(true);
  };

  const handleVerifyOtp = async () => {
    setReSendOtp(false);
    if (otpInput === "") {
      message.error("Please enter the otp");
      return;
    }

    try {
      let response = await axios.get(
        `${validateOtpForCanvasQuiz}${props.guid}/${props.studentId}/${otpInput}`,
        {
          headers: {
            Authorization: `Bearer ${props.authToken}`,
          },
        }
      );
      props.otpVerified(true);
      setVerificaitonStatus(true);
    } catch (e) {
      setVerificaitonStatus(false);
    }
  };

  useEffect(() => {
    generateOpt();
  }, []);

  return (
    <div className="flex flex-col w-2/5 h-full gap-4 justify-center">
      <div className="box-border w-full h-full border-2 border-gray-400 rounded">
        <div className="flex flex-col gap-1 p-4 h-full w-full items-center">
          <p className="text-base font-semibold">
            An OTP (One Time Passcode) has been sent to email address.
          </p>
          <p className="text-base font-semibold">
            Please enter the OTP below to verify.
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-xl font-bold">Enter OTP</p>
        <div className="flex flex-row h-full w-full gap-2">
          <input
            onChange={handleInputChange}
            value={otpInput}
            type="text"
            id="first_name"
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter OTP"
            required
          />
          <div className="self-center">
            <button
              onClick={handleVerifyOtp}
              type="button"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Verify
            </button>
          </div>
          <div className="self-center">
            <button
              onClick={handleResendOTP}
              type="button"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Resend
            </button>
          </div>
        </div>
      </div>
      <br />
      {reSendOtp && (
        <div
          className="flex h-full items-center p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
          role="alert"
        >
          <span className="sr-only">Info</span>
          <div className="flex w-full h-full font-semibold text-center items-center">
            An OTP has been sent to your registered email. Please check and
            enter the otp to verify. Thanks
          </div>
        </div>
      )}
      {verificationStatus ? (
        <div
          className="p-4 mb-4 text-sm text-center text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
          role="alert"
        >
          <span className="font-medium">Congratulation, </span> otp verified
          successfully.
        </div>
      ) : (
        verificationStatus === false && (
          <div
            className="p-4 mb-4 text-sm text-red-700 text-center bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
            role="alert"
          >
            <span className="font-medium">Otp verification failed.</span>
          </div>
        )
      )}
    </div>
  );
};
export default OtpVerification;
