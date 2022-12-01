import React from "react";

const Notifications: React.FC = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full md:w-3/5 justify-center gap-4 mt-4">
      <div className="flex flex-col w-full justify-center">
        <label className="block text-gray-700 text-base font-semibold mb-1">
          Topic
        </label>
        <select
          className="form-select form-select-sm
            appearance-none
            block
            px-2
            py-1
            w-full
            md:w-3/5
            lg:w-2/5
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
        ></select>
      </div>
      <div className="w-full border border-gray-400 p-2 rounded mt-4 shadow-md">
        <div className="grid grid-cols-3 gap-1 justify-center">
          <div className="flex flex-col w-full justify-center">
            <label className="block text-gray-700 text-base font-semibold mb-1">
              Status
            </label>
            <select
              className="form-select form-select-sm
            appearance-none
            block
            px-2
            py-1
            w-full
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
            ></select>
          </div>
          <div className="flex h-full justify-center">
            <div className="flex flex-row h-full items-center mt-4">
              <input
                className="h-4 w-4 cursor-pointer"
                type="checkbox"
                value=""
                id="textMessage"
              />
              <label className="text-gray-800 ml-2" htmlFor="flexCheckDefault">
                Text Message
              </label>
            </div>
          </div>
          <div className="flex flex-col w-full justify-center">
            <label className="block text-gray-700 text-base font-semibold mb-1">
              Message
            </label>
            <select
              className="form-select form-select-sm
            appearance-none
            block
            px-2
            py-1
            w-full
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
              id="messageSelect"
            ></select>
          </div>
        </div>
        <div className="flex flex-col w-full justify-center">
          <label className="block text-gray-700 text-base font-semibold mb-1 mt-8">
            Message
          </label>
          <textarea
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
            id="notificationMessage"
            rows={6}
            placeholder="Your message"
          ></textarea>
        </div>
      </div>
      <div className="flex flex-row h-full w-full items-center justify-end gap-4">
        <button
          type="button"
          id="cancel"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Cancel
        </button>
        <button
          type="button"
          id="submit"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Notifications;
