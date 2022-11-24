import create from "zustand";
import { devtools } from "zustand/middleware";
import {
  AddInsitutePropertyTypes,
  ContactDetailsFieldTypes,
  InstituteAndAccessDetailsFieldTypes,
} from "../AppTypes";

type AddInstituteStore = {
  instituteAndAccessDetails: InstituteAndAccessDetailsFieldTypes;
  instituteTypes: string[];
  lmsTypes: string[];
  status: string[];
  conactDetails: ContactDetailsFieldTypes;
  handleInstituteTypeSelect: (option: string) => void;
  handleLmsTypeSelect: (option: string) => void;
  handleStatusSelect: (option: string) => void;
  handleInstituteDetailsUpdate: (key: string, value: string) => void;
  handleContactDetailsUpdate: (key: string, value: string) => void;
  handleResetValues: () => void;
};

export const useAddInstituteStore = create<AddInstituteStore>()(
  devtools(
    (set, get) => ({
      instituteAndAccessDetails: {
        instituteType: {
          value: "Select institute type",
          label: "Select institute type",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        lmsType: {
          value: "Select lms type",
          label: "Select lms type",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        status: {
          value: "Active",
          label: "Active",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        invokeUrl: {
          value: "",
          label: "Invoke Url",
          placeholder: "Please enter Invoke Url",
          hasError: false,
          errorMsg: "",
        },
        launchUrl: {
          value: "",
          label: "Launch Url",
          placeholder: "Please enter launch Url",
          hasError: false,
          errorMsg: "",
        },
        apiAccessUrl: {
          value: "",
          label: "Api Access URL",
          placeholder: "Please enter api access url",
          hasError: false,
          errorMsg: "",
        },
        instituteName: {
          value: "",
          label: "Institute Name",
          placeholder: "Please enter institute name",
          hasError: false,
          errorMsg: "",
        },
        campusName: {
          value: "",
          label: "Campus Name",
          placeholder: "Please enter campus name",
          hasError: false,
          errorMsg: "",
        },
        instituteUrl: {
          value: "",
          label: "Institute Url",
          placeholder: "Please enter institute url",
          hasError: false,
          errorMsg: "",
        },
        token: {
          value: "",
          label: "Token",
          placeholder: "Please enter token",
          hasError: false,
          errorMsg: "",
        },
        config: {
          value: "",
          label: "Configurtion",
          placeholder: "Please enter configuration",
          hasError: false,
          errorMsg: "",
        },
        secret: {
          value: "",
          label: "Secret",
          placeholder: "Please enter secret code",
          hasError: false,
          errorMsg: "",
        },
        accId: {
          value: "",
          label: "Account Id",
          placeholder: "Please enter account id",
          hasError: false,
          errorMsg: "",
        },
        cliendId: {
          value: "",
          label: "Client Id",
          placeholder: "Please enter client id",
          hasError: false,
          errorMsg: "",
        },
        xmlUrl: {
          value: "",
          label: "XML Url",
          placeholder: "Please enter xml url",
          hasError: false,
          errorMsg: "",
        },
      },
      instituteTypes: [
        "Select institute type",
        "University",
        "College",
        "Testing Services",
      ],
      lmsTypes: ["Select lms type", "Canvas", "Black Board", "Moodle", "D2L", "Sakai", "Others"],
      status: ["Select status", "Active", "Inactive"],
      conactDetails: {
        firstName: {
          value: "",
          label: "First Name",
          placeholder: "Please enter first name",
          hasError: false,
          errorMsg: "",
        },
        lastName: {
          value: "",
          label: "Last Name",
          placeholder: "Please enter last name",
          hasError: false,
          errorMsg: "",
        },
        email: {
          value: "",
          label: "Email",
          placeholder: "Please enter your email",
          hasError: false,
          errorMsg: "",
        },
        phone: {
          value: "",
          label: "Phone",
          placeholder: "Please enter phone number",
          hasError: false,
          errorMsg: "",
        },
        firstAddress: {
          value: "",
          label: "Address 1",
          placeholder: "Please enter address 1",
          hasError: false,
          errorMsg: "",
        },
        secondAddress: {
          value: "",
          label: "Address 2",
          placeholder: "Please enter address 2",
          hasError: false,
          errorMsg: "",
        },
        city: {
          value: "",
          label: "City",
          placeholder: "Please enter city",
          hasError: false,
          errorMsg: "",
        },
        state: {
          value: "",
          label: "State",
          placeholder: "Please enter state",
          hasError: false,
          errorMsg: "",
        },
        zip: {
          value: "",
          label: "Zip",
          placeholder: "Please enter zip code",
          hasError: false,
          errorMsg: "",
        },
        country: {
          value: "",
          label: "Country",
          placeholder: "Please enter country",
          hasError: false,
          errorMsg: "",
        },
      },
      handleInstituteTypeSelect: (option: string) => {
        let instituteType = {
          ...get().instituteAndAccessDetails.instituteType,
        };
        instituteType.value = option;
        instituteType.label = option;
        if (instituteType.hasError) {
          if (option !== "Select institute type") {
            instituteType.hasError = false;
            instituteType.errorMsg = "";
          }
        }
        set({
          instituteAndAccessDetails: {
            ...get().instituteAndAccessDetails,
            instituteType: instituteType,
          },
        });
      },
      handleLmsTypeSelect: (option: string) => {
        let lmsType = { ...get().instituteAndAccessDetails.lmsType };
        lmsType.value = option;
        lmsType.label = option;
        if (lmsType.hasError) {
          if (option !== "Select lms type") {
            lmsType.hasError = false;
            lmsType.errorMsg = "";
          }
        }
        set({
          instituteAndAccessDetails: {
            ...get().instituteAndAccessDetails,
            lmsType: lmsType,
          },
        });
      },
      handleStatusSelect: (option: string) => {
        let status = { ...get().instituteAndAccessDetails.status };
        status.value = option;
        status.label = option;
        if (status.hasError) {
          if (option !== "Select status") {
            status.hasError = false;
            status.errorMsg = "";
          }
        }
        set({
          instituteAndAccessDetails: {
            ...get().instituteAndAccessDetails,
            status: status,
          },
        });
      },
      handleInstituteDetailsUpdate: (key: string, value: string) => {
        let option = {
          ...get().instituteAndAccessDetails[
            key as keyof InstituteAndAccessDetailsFieldTypes
          ],
        };
        option.value = value;
        set({
          instituteAndAccessDetails: {
            ...get().instituteAndAccessDetails,
            [key]: option,
          },
        });
      },
      handleContactDetailsUpdate: (key: string, value: string) => {
        let option = {
          ...get().conactDetails[key as keyof ContactDetailsFieldTypes],
        };
        option.value = value;
        set({
          conactDetails: {
            ...get().conactDetails,
            [key]: option,
          },
        });
      },
      handleResetValues: () => {
        let instituteAndAccessDetails: InstituteAndAccessDetailsFieldTypes = {
          ...get().instituteAndAccessDetails,
        };
        let contactDetails: ContactDetailsFieldTypes = {
          ...get().conactDetails,
        };
        Object.keys(instituteAndAccessDetails).forEach((key: string) => {
          if (key === "instituteType") {
            instituteAndAccessDetails[
              key as keyof InstituteAndAccessDetailsFieldTypes
            ].value = "Select institute type";
            instituteAndAccessDetails[
              key as keyof InstituteAndAccessDetailsFieldTypes
            ].hasError = false;
            instituteAndAccessDetails[
              key as keyof InstituteAndAccessDetailsFieldTypes
            ].errorMsg = "";
          }
          if (key === "lmsType") {
            instituteAndAccessDetails[
              key as keyof InstituteAndAccessDetailsFieldTypes
            ].value = "Select lms type";
            instituteAndAccessDetails[
              key as keyof InstituteAndAccessDetailsFieldTypes
            ].hasError = false;
            instituteAndAccessDetails[
              key as keyof InstituteAndAccessDetailsFieldTypes
            ].errorMsg = "";
          }
          if (key === "status") {
            instituteAndAccessDetails[
              key as keyof InstituteAndAccessDetailsFieldTypes
            ].value = "Select lms type";
            instituteAndAccessDetails[
              key as keyof InstituteAndAccessDetailsFieldTypes
            ].hasError = false;
            instituteAndAccessDetails[
              key as keyof InstituteAndAccessDetailsFieldTypes
            ].errorMsg = "Active";
          }
          instituteAndAccessDetails[
            key as keyof InstituteAndAccessDetailsFieldTypes
          ].value = "";
        });
        Object.keys(contactDetails).forEach((key: string) => {
          contactDetails[key as keyof ContactDetailsFieldTypes].errorMsg = "";
          contactDetails[key as keyof ContactDetailsFieldTypes].value = "";
          contactDetails[key as keyof ContactDetailsFieldTypes].hasError =
            false;
        });
        set({
          instituteAndAccessDetails: { ...instituteAndAccessDetails },
          conactDetails: { ...contactDetails },
        });
      },
    }),
    { name: "Add Institute Store" }
  )
);
