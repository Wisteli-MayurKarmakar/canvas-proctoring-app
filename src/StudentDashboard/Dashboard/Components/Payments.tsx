import { Modal } from "antd";
import axios from "axios";
import React, { RefObject, useEffect, useRef } from "react";
import { getLtiStudentProfileDetails } from "../../../apiConfigs";
import { useAppStore } from "../../../store/AppSotre";
import { usePaymentsStore } from "../../../store/PaymentsStore";

type Props = {
  visible: boolean;
  close: () => void;
};

const Payments: React.FC<Props> = ({ visible, close }): JSX.Element => {
  const {
    setUserDetails,
    selectedProvider,
    providers,
    setProvider,
    firstName,
    lastName,
    email,
    billingEmail,
    message,
    setBillingEmail,
    setMessage,
  } = usePaymentsStore((state) => state);

  let paypal: any = useRef();

  const handleProvider = (value: string) => {
    setProvider(value);
  };

  useEffect(() => {
    if (selectedProvider === "Paypal") {
      (window as any).paypal
        .Buttons({
          style: {
            layout: "horizontal",
            color: "blue",
            shape: "pill",
            label: "pay",
          },
          createOrder: (data: any, action: any, error: any) => {
            return action.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: "Test payment",
                  amount: {
                    currency_code: "USD",
                    value: 1.0,
                  },
                },
              ],
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            console.log(order);
          },
          onError: (err: any) => {
            console.log(err);
          },
        })
        .render(paypal.current);
    }
  }, [selectedProvider]);

  useEffect(() => {
    setUserDetails();
  }, []);

  return (
    <Modal
      visible={visible}
      onCancel={close}
      title="Payment Details"
      maskClosable={false}
      width={"70pc"}
      footer={[
        <button
          type="button"
          id="cancel"
          key="cancel"
          onClick={close}
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Cancel
        </button>,
        <button
          id="submit"
          type="button"
          key="submit"
          className="inline-block px-6 py-2.5 bg-blue-600 ml-8 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Submit
        </button>,
      ]}
    >
      <div className="flex flex-col w-full justify-center gap-4">
        <div className="flex flex-col w-full justify-center">
          <label className="block text-gray-700 text-base font-semibold mb-1">
            Provider
          </label>
          <select
            className="form-select form-select-sm
                appearance-none
                block
                px-2
                py-1
                w-full
                md:w-1/5
                text-sm
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-black focus:bg-white focus:border-blue-400 focus:outline-none"
            aria-label=".form-select-sm example"
            id="topicSelect"
            value={selectedProvider}
            onChange={(e) => handleProvider(e.target.value)}
          >
            {providers.map((item: string, index: number) => {
              return (
                <option id={item} value={item} key={index}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4 justify-center">
          <div className="flex flex-col w-full justify-center">
            <label className="block text-gray-700 text-base font-semibold mb-1">
              First Name
            </label>
            <input
              type="text"
              disabled={true}
              value={firstName}
              className="
                    form-control
                    block
                    w-full
                    px-3
                    py-1
                    text-base
                    font-normal
                    text-gray-700
                    cursor-not-allowed
                    bg-gray-200 bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                "
              id="firstName"
              placeholder="Example label"
            />
          </div>
          <div className="flex flex-col w-full justify-center">
            <label className="block text-gray-700 text-base font-semibold mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              disabled={true}
              className="
                    form-control
                    block
                    w-full
                    px-3
                    py-1
                    text-base
                    font-normal
                    text-gray-700
                    cursor-not-allowed
                    bg-gray-200 bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                "
              id="firstName"
              placeholder="Example label"
            />
          </div>
          <div className="flex flex-col w-full justify-center">
            <label className="block text-gray-700 text-base font-semibold mb-1">
              Email
            </label>
            <input
              type="text"
              value={email === "" ? "No email" : email}
              disabled={true}
              className="
                    form-control
                    block
                    w-full
                    px-3
                    py-1
                    text-base
                    font-normal
                    text-gray-700
                    cursor-not-allowed
                    bg-gray-200 bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                "
              id="firstName"
              placeholder="Example label"
            />
          </div>
        </div>
        <div className="flex flex-row h-full items-center gap-8">
          <div className="flex flex-col w-full justify-center">
            <label className="block text-gray-700 text-base font-semibold mb-1">
              Billing Email
            </label>
            <div className="flex flex-row h-full items-center gap-16">
              <input
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                type="email"
                className="
                    form-control
                    flex-none
                    w-full
                    md:w-2/6
                    px-3
                    py-1
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                "
                id="billingEmail"
                placeholder="Billing email"
              />
              <p className="font-semibold w-full">
                (If different than communication email)
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full justify-center">
          <label className="block text-gray-700 text-base font-semibold mb-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="
                form-control
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
          "
            id="paymentMessage"
            rows={6}
            placeholder="Your message"
          ></textarea>
        </div>
        <div className="flex items-center justify-center">
          {selectedProvider === "Paypal" && (
            <div ref={paypal} className="self-center"></div>
          )}
        </div>
      </div>
    </Modal>
  );
  //     <Modal
  //       visible={visible}
  //       onCancel={close}
  //       title="Payment Details"
  //       maskClosable={false}
  //       width={"70pc"}
  //       footer={[
  //         <button
  //           type="button"
  //           id="cancel"
  //           key="cancel"
  //           className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
  //         >
  //           Cancel
  //         </button>,
  //         <button
  //           id="submit"
  //           type="button"
  //           key="submit"
  //           className="inline-block px-6 py-2.5 bg-blue-600 ml-8 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
  //         >
  //           Submit
  //         </button>,
  //       ]}
  //     >
  //       <p className="text-center mx-auto text-lg font-semibold">
  //         Fetching details. Please wait...
  //       </p>
  //     </Modal>
  //   );
};

export default Payments;
