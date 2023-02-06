import { CloudDownloadOutlined } from "@ant-design/icons";
import React from "react";

const LazyLoading: React.FC = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full justify-center gap-4">
      <CloudDownloadOutlined
        className="text-4xl"
        style={{ color: "#81ddf0" }}
      />
      <p className="text-center font-semibold text-lg">
        Loading...
      </p>
    </div>
  );
};

export default LazyLoading;
