import React from "react";

const Thanks: React.FC = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <p className="text-2xl font-bold text-blue-500">Thank you.</p>
      <p className="text-lg font-semibold">
        Please go back to Quiz and Continue
      </p>
    </div>
  );
};

export default Thanks;
