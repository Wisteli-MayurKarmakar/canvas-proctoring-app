import axios from "axios";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { getLtiCanvasConfigByGuidCourseIdQuizId } from "../apiConfigs";
import {
  AssignmentConfiguration,
  defualtProctingSettings,
  Quiz,
  QuizConfig,
} from "../AppTypes";
import { defaultProcSettings } from "../CommonUtilites/ProctorSettingDefaults";
import { useAppStore } from "../store/AppSotre";

type QuizStore = {
  allQuizzes: Quiz[];
  selectedQuiz: Quiz | null;
  selectedQuizConfig: QuizConfig | null;
  customizableQuizConfig: QuizConfig | null;
  defaultOptionSelected: string | null;
  setAllQuizzes: (quizzes: Quiz[]) => void;
  setSelectedQuiz: (quiz: Quiz) => void;
  setDefaultOptionSelection: (optionName: string, flag: boolean) => void;
  updateQuizConfig: (configName: string) => void;
};

const getSelectedQuizConfig = async (
  quizId: string
): Promise<AssignmentConfiguration | null> => {
  const guid: string = useAppStore.getState().urlParamsData.guid as any;
  const courseId: string = useAppStore.getState().urlParamsData.courseId as any;

  if (guid && courseId) {
    let response = await axios.get(
      `${getLtiCanvasConfigByGuidCourseIdQuizId}?guid=${guid}&courseId=${courseId}&quizId=${quizId}`
    );
    if (response.status === 200) {
      return response.data;
    }
  }

  return null;
};

export const useQuizStore = create<QuizStore>()(
  devtools(
    (set, get) => ({
      allQuizzes: [],
      selectedQuiz: null,
      defaultOptionSelected: null,
      selectedQuizConfig: null,
      customizableQuizConfig: null,
      setAllQuizzes: (quizzes: Quiz[]) => {
        set({ allQuizzes: quizzes });
      },
      setSelectedQuiz: async (quiz: Quiz) => {
        set({ selectedQuiz: quiz, selectedQuizConfig: null });

        let quizConfig: AssignmentConfiguration | null =
          await getSelectedQuizConfig(quiz.id);

        if (quizConfig) {
          set({
            selectedQuizConfig: quizConfig,
            customizableQuizConfig: quizConfig,
          });
        }
      },
      setDefaultOptionSelection: (optionName: string, flag: boolean) => {
        if (flag && optionName !== "") {
          let configByOption: defualtProctingSettings[] =
            defaultProcSettings.filter(
              (item: defualtProctingSettings) => item.name === optionName
            );

          set({
            defaultOptionSelected: optionName,
            selectedQuizConfig: configByOption[0].settings,
          });
        } else {
          set({
            defaultOptionSelected: "",
            selectedQuizConfig: get().selectedQuizConfig,
          });
        }
      },
      updateQuizConfig: (configName: string) => {
        let config: QuizConfig | null = get().customizableQuizConfig;
        if (config) {
          config[configName as keyof QuizConfig] =
            !config[configName as keyof QuizConfig];
          set({ customizableQuizConfig: config });
        }
      },
    }),
    { name: "Quiz Store" }
  )
);
