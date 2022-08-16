import React, { FunctionComponent } from "react";

interface Props {
  title: string;
  message: any;
}

const InfoModal: FunctionComponent<Props> = (props): JSX.Element => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
          <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
              <div className="flex flex-row">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-8 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 fill-blue-500"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-center w-full h-full sm:text-left">
                  <h3
                    className="leading-6 font-medium text-gray-900 text-2xl"
                    id="modal-title"
                  >
                    {props.title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-xl text-gray-500">{props.message}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
