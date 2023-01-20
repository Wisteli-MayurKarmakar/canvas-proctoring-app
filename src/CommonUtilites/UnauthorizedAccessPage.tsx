import { StopOutlined } from "@ant-design/icons";
import React from "react";

const UnauthorizedAccessPage: React.FC = (): JSX.Element => {
    return (
        <div className="grid place-items-start h-screen mt-16">
            <div className="flex flex-row items-center justify-center mx-auto gap-4">
                <div className="self-center">
                    <StopOutlined className="text-5xl" style={{ color: "red" }} />
                </div>
                <div className="flex flex-col h-full justify-center border-l-2 border-black pl-4">
                    <p className="text-3xl text-red-400 underline">Invalid or Suspended Account</p>
                    <p className="text-xl pt-2">You do not have access to this LTI app.</p>
                    <p className="text-xl break-words">If you're a <strong>professor</strong> or <strong>administrator</strong> please contact your <strong>Canvas admin</strong></p>
                    <p className="text-xl">or email to <span className="text-blue-500">"sales@beyondexam.com"</span> for more information.</p>
                    <p className="text-xl mt-8">Thank you.</p>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedAccessPage;
