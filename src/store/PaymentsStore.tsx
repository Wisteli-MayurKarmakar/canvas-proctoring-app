import axios from "axios";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { getLtiStudentProfileDetails } from "../apiConfigs";
import { PaymentStoreType, StudentDetails } from "../AppTypes";
import { useAppStore } from "./AppSotre";

const getUserDetails = async (): Promise<StudentDetails | null> => {
  const { urlParamsData } = useAppStore.getState();
  let response = await axios.post(
    `${getLtiStudentProfileDetails}${urlParamsData.guid}/${urlParamsData.studentId}`
  );
  if (response.status === 200) {
    return response.data;
  }
  return null;
};

export const usePaymentsStore = create<PaymentStoreType>()(
  devtools(
    (set) => ({
      providers: ["Select provider", "Paypal", "Stripe"],
      selectedProvider: "Select provider",
      firstName: "",
      lastName: "",
      email: "",
      userDetails: {
        idLtiStudentProfile: "",
        guid: "",
        idUser: "",
        firstName: "",
        lastName: "",
        email: "",
        idFileIndex1: "",
        idFileIndex2: "",
        idFileName1: "",
        idFileName2: "",
        status: 0,
        createUser: null,
        createDate: "",
        modifyUser: null,
        modifyDate: null,
      },
      billingEmail: "",
      message: "",
      setBillingEmail: (value: string) => {
        set({
          billingEmail: value,
        });
      },
      setMessage: (value: string) => {
        set({
          message: value,
        });
      },
      setProvider: (value: string) => {
        set({
          selectedProvider: value,
        });
      },
      setUserDetails: async () => {
        let details = await getUserDetails();
        if (details) {
          set({
            userDetails: details,
            firstName: details.firstName,
            lastName: details.lastName,
            email: details.email,
          });
        }
      },
    }),
    { name: "Payment Store" }
  )
);
