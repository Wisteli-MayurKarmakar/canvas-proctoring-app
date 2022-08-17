import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import VideoAndScreenRec from "./videoAndScreenRec";
import $ from "jquery";

interface Props {
  courseId: string;
  authToken: string;
  username: string;
  pass: string;
  procData: any;
  id: string;
  toolConsumerGuid: string;
  quizId: string;
  isNewTab: boolean;
  isAuthed: boolean;
  studentId: string;
}

const Quzzies: React.FC<Props> = (props) => {
  let [quizzes, setQuizzes] = React.useState<Object[] | null>(null);
  let [selectedQuiz, setSelectedQuiz] = React.useState<Object | null>(null);
  let [quizObj, setQuizObj] = React.useState<Object | any>({});

  useEffect(() => {
    $(document).bind("keyup keydown", function (e) {
      if (e.ctrlKey && e.keyCode == 80) {
        return false;
      }
    });
    console.log("Quizzes: useEffect", props);
    axios
      .get(
        `https://examd-dev.uc.r.appspot.com/student/api/v1/fetchCanvasQuizzesByCourseId/${props.courseId}`,
        {
          headers: {
            Authorization: `Bearer ${props.authToken}`,
          },
        }
      )
      .then((res) => {
        let temp: any = {};
        res.data.forEach((item: any) => {
          temp[item.id] = false;
        });
        setQuizzes(res.data);
        setQuizObj(temp);
        if (props.quizId) {
          let x = { [props.quizId]: true };
          setQuizObj(x);
          setSelectedQuiz(
            res.data.find((item: any) => item.id === props.quizId)
          );
        }
        // if (selectedQuiz) {
        //   let id = JSON.parse(selectedQuiz).id;
        //   setSelectedQuiz(JSON.parse(selectedQuiz));
        //   localStorage.removeItem("selectedQuiz");
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const startQuizz = (quizz: Object | any) => {
    if (
      moment(quizz.all_dates.due_at).isBefore(moment()) ||
      Object.keys(quizz.all_dates).length === 0
    ) {
      return;
    }
    let qObj: any = { ...quizObj };

    Object.keys(qObj).forEach((key: any) => {
      qObj[key] = false;
    });

    qObj[quizz.id] = true;
    setQuizObj(qObj);
    setSelectedQuiz(quizz);
  };

  if (quizzes) {
    return (
      <div className="flex flex-col gap-5 justify-center items-center h-screen mx-auto mt-5 text-center container text-lg ">
        <div className="flex flex-row gap-10">
          {quizzes.map((quiz: any, index) => {
            return (
              <div
                // href="#"

                style={{
                  cursor:
                    moment(quiz.all_dates.due_at).isBefore(moment()) ||
                    Object.keys(quiz.all_dates).length === 0
                      ? "not-allowed"
                      : "pointer",
                }}
                key={index}
                onClick={() => startQuizz(quiz)}
                className={`block p-6 max-w-sm bg-white rounded-lg border ${
                  quizObj[quiz.id]
                    ? "border-blue-600 border-4"
                    : "border-gray-200"
                } hover:bg-gray-100 dark:${
                  quizObj[quiz.id] ? "border-blue-600" : "border-gray-700"
                } dark:hover:bg-gray-300`}
              >
                <h1>{quiz.title}</h1>
                <p>Type: {quiz.quiz_type}</p>
              </div>
            );
          })}
        </div>
        <VideoAndScreenRec
          quiz={selectedQuiz}
          username={props.username}
          pass={props.pass}
          procData={props.procData}
          token={props.authToken}
          id={props.id}
          isNewTab={props.isNewTab}
          courseId={props.courseId}
          toolConsumerGuid={props.toolConsumerGuid}
          isAuthed={props.isAuthed}
          studentId={props.studentId}
        />
      </div>
    );
  } else {
    return (
      <div className="flex gap-8 absolute top-2/4 left-2/4">
        <p className="text-center">Fetching quizzes...</p>
        <div role="status">
          <svg
            className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-green-500 "
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
};

export default Quzzies;
