import axios from "axios";
import moment, { Moment } from "moment";
import React, { useEffect, useState } from "react";
import { fetchCanvasEnrollmentsByInstituteForSevenDays } from "../apiConfigs";
import { useAppStore } from "../store/AppSotre";
import LiveStreaming from "./Modals/LiveStreaming";

type Student = {
  email: string;
  name: string;
  quizId: number;
  schedule: string;
};

const StudentProctoringForWeek: React.FC = (): JSX.Element => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const tokenData = useAppStore((state) => state.tokenData);
  const urlParamsData = useAppStore((state) => state.urlParamsData);

  const weekDays: string[] = [];
  const startOfWeek: Moment = moment().startOf("isoWeek");
  const endOfWeek: Moment = moment().endOf("isoWeek");
  let day = startOfWeek;

  while (day <= endOfWeek) {
    weekDays.push(day.toISOString());
    day = day.clone().add(1, "d");
  }

  const fetchStudents = async () => {
    let response = await axios.get(
      `${fetchCanvasEnrollmentsByInstituteForSevenDays}/${tokenData.instituteId}/${urlParamsData.courseId}/student/${urlParamsData.accountId}/${urlParamsData.guid}/${tokenData.lmsAccessToken}`
    );

    if (response.status === 200) {
      setStudents(response.data);
    } else {
      setIsFailed(true);
    }
    setIsFetching(false);
  };


  useEffect(() => {
    fetchStudents();
  }, []);

  if (!isFetching) {
    if (!isFailed) {
      if (students.length > 0) {
        return (
          <div className="flex flex-col w-full justify-start gap-4 mt-4">
            <div className="flex flex-row flex-wrap w-full gap-8 h-full items-center justify-center">
              {students.map((student: Student, index: number) => {
                return (
                  <div
                    className="box-border border rounded shadow-lg w-36 h-36 bg-gray-100 text-black"
                    key={index}
                  >
                    <div className="flex flex-col w-full h-full items-center justify-center gap-4 p-2">
                      <p className="text-lg text-center truncate w-full font-semibold">
                        {student.name}
                      </p>
                      <p className="text-sm text-center break-before-right font-semibold">
                        {moment(student.schedule + "Z").format(
                          "MM/DD/YYYY hh:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      } else {
        return (
          <p className="text-semibold mt-2 text-center">
            No students available for proctoring
          </p>
        );
      }
    } else {
      return (
        <p className="flex items-center justify-between text-red-600 text-center font-bold text-xl">
          Could not fetch students. Please refresh the page.
        </p>
      );
    }
  }

  return (
    <p className="text-blue-500 text-center font-bold text-xl">
      Fetching Students. Please wait...
    </p>
  );
};

export default StudentProctoringForWeek;
