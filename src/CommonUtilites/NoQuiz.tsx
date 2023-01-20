import React, { PropsWithChildren } from "react";


const NoQuiz: React.FC<PropsWithChildren> = ({children}): JSX.Element => {
    return <div className="flex flex-col h-full w-full items-center justify-center mt-8">
        {children}
        <p className="text-xl font-semibold text-center">Right now there is no quiz associated with this course. Please create a quiz and click the app.</p>
    </div>
}

export default NoQuiz;