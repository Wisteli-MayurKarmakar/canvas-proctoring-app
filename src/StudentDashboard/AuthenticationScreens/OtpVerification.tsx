import React from "react";

const OtpVerification: React.FC = () => {
  return (
    <div className="flex flex-col justify-center">
      <p className="text-xl">Enter OTP</p>
      <div className="flex flex-row gap-4">
        <input
          type="text"
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-44 p-2.5 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter OTP"
          required
        />
        <button
          type="button"
          className="py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </div>
      <br />
      <p>Please enter the otp sent to your registered email.</p>
    </div>
  );
};
export default OtpVerification;
