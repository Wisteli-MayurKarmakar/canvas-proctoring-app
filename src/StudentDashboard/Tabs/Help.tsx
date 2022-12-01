import { Button, message, Modal } from "antd";
import axios from "axios";
import React from "react";
import { sendEmail } from "../../apiConfigs";
import emailjs from "@emailjs/browser";

interface Props {
  visible: boolean;
  onCancel: () => void;
  authToken: string;
  student: any;
}

const Help: React.FC<Props> = (props): JSX.Element => {
  let [supportEmail, setSupportEmail] =
    React.useState<string>("Mini.help@examd.co");
  let [helpType, setHelpType] = React.useState<string>("General Help");
  let [email, setEmail] = React.useState<string | null>(null);
  let [isEmailValid, setIsEmailValid] = React.useState<boolean>(true);
  let [isPhoneValid, setIsPhoneValid] = React.useState<boolean>(true);
  let [phoneNumber, setPhoneNumber] = React.useState<string | null>(null);
  let [prefix, setPrefix] = React.useState<string | null>(null);
  let [isLoading, setIsLoading] = React.useState<boolean>(false);
  let [reqText, setReqText] = React.useState<string | null>(null);
  const helpMail = "Mini.help@examd.co";

  const handleChange = (e: any) => {
    if (e.target.value.length > 10) {
      e.target.value = e.target.value.substring(0, 10);
    }

    if (!e.target.value.match(/^[0-9]+$/)) {
      e.target.value = "";
    } else {
      setPhoneNumber(e.target.value);
    }
  };

  const checkIfValidEmail = (email: string) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = () => {
    if (email) {
      let isValid = checkIfValidEmail(email);
      if (!isValid) {
        setIsEmailValid(false);
        message.error("Please enter a valid email address");
        return;
      }
    } else {
      setIsEmailValid(false);
      message.error("Please enter an email address");
      return;
    }

    if (phoneNumber) {
      if (phoneNumber.length !== 10) {
        console.log("phone number is not valid");
        setIsPhoneValid(false);
        message.error("Please enter a valid phone number");
        return;
      }
    } else {
      console.log("no phone number");
      setIsPhoneValid(false);
      message.error("Please enter a phone number");
      return;
    }

    if (!reqText) {
      message.error("Please enter a help concern");
      return;
    }

    let reqData = {
      recipient: helpMail,
      subject: `${helpType} Question`,
      htmlBody: `${reqText}<br><br>
                Phone: ${phoneNumber}<br>
                Email: ${email}<br>`,
      emailPrefixTemplate: true,
    };

    setIsLoading(true);

    let serviceId: string = "service_2su5kx4";
    let templateId: string = "template_iqbfsp2";
    let pubKey: string = "qaGgmKlvzp5138RXC";

    let messageBody: { [key: string]: string } = {
      subject: `${helpType} request from ${props?.student.user.name}`,
      recipent_name: "help@examd.co",
      message: `${props?.student.user.name} needs ${helpType}. Below are the details to reach out to ${props?.student.user.name}:<br>
      Phone: ${phoneNumber}<br>
      Email: ${email}<br><br><br>
      Thanks
      `,
      send_to: helpMail,
      reply_to: "devshantanu@gmail.com",
    };

    emailjs
      .send(serviceId, templateId, messageBody, pubKey)
      .then((response) => {
        message.success("Your request has been sent");
        setIsLoading(false);
        props.onCancel();
      })
      .catch((error) => {
        message.error("Something went wrong. Please try again");
        setIsLoading(false);
        props.onCancel();
      });
    // axios
    //   .post(sendEmail, reqData, {
    //     headers: {
    //       Authorization: `Bearer ${props.authToken}`,
    //     },
    //   })
    //   .then((res: any) => {
    //     message.success("Your request has been sent");
    //     props.onCancel();
    //   })
    //   .catch((err: any) => {
    //     setIsLoading(false);
    //     message.error("Something went wrong. Please try again");
    //   });
  };

  return (
    <Modal
      maskClosable={false}
      title="Help"
      width={"50pc"}
      visible={props.visible}
      onCancel={props.onCancel}
      footer={[
        <Button
          key="back"
          type="primary"
          onClick={props.onCancel}
          className="!bg-blue-600 !rounded"
        >
          Close
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={() => handleSubmit()}
          className="!bg-blue-600 !rounded"
        >
          Submit
        </Button>,
      ]}
    >
      <div className="flex flex-col h-full items-center justify-center">
        <div className="flex flex-col w-full h-full">
          <label
            htmlFor="countries"
            className="block mb-2 text-xl font-medium  text-black"
          >
            Select help type
          </label>
          <select
            id="countries"
            onChange={(e) => setHelpType(e.target.value)}
            className="bg-gray-50 text-center font-semibold border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-black dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option>Technical Help</option>
            <option>General Help</option>
          </select>
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2 w-full h-full mt-5">
          <div>
            <label
              htmlFor="first_name"
              className="block mb-2 text-xl font-medium text-black"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className={`bg-gray-50 border border-gray-300 ${
                !isEmailValid && "border-2"
              } text-black font-semibold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white ${
                !isEmailValid ? "dark:border-red-500" : "dark:border-gray-600"
              } dark:placeholder-black dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="Please enter your email"
              required
            />
            {!isEmailValid && (
              <div className="text-red-500 text-xs italic">
                Please enter a valid email address
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block mb-2 text-xl font-medium text-black"
            >
              Your Phone number
            </label>
            <div className="flex flex-row w-full">
              <select
                id="countries"
                className="bg-gray-50 text-center font-semibold border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20  dark:bg-white dark:border-gray-600 dark:placeholder-black dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option>+1</option>
                <option>+91</option>
              </select>
              <input
                type="text"
                onChange={(e) => handleChange(e)}
                id="phone_number"
                className={`bg-gray-50 border ${
                  !isPhoneValid && "border-2"
                } border-gray-300 text-black font-semibold text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white ${
                  isPhoneValid ? "dark:border-gray-600" : "dark:border-red-600"
                }  dark:placeholder-black dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="Please enter your ph. number"
                required
              />
            </div>
            {!isPhoneValid && (
              <div className="text-red-500 text-xs italic">
                Please enter a valid phone number
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="">
            <label
              htmlFor="message"
              className="block mb-2 text-xl font-medium text-black"
            >
              Your Concern
            </label>
            <textarea
              id="message"
              rows={4}
              onChange={(e) => setReqText(e.target.value)}
              className="block p-2.5 w-full text-sm font-semibold text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white dark:border-gray-600 dark:placeholder-black dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your concern..."
            ></textarea>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Help;
