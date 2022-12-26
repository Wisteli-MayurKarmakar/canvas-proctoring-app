import { message } from "antd";
import axios from "axios";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { getLtiInstitute, saveLtiInstitute } from "../apiConfigs";
import {
  ContactDetailsFieldTypes,
  InstituteAndAccessDetailsFieldTypes,
  InstituteDetails,
  SaveLtiInsituteDataType,
} from "../AppTypes";
import { useAppStore } from "./AppSotre";

type AddInstituteStore = {
  instituteAndAccessDetails: InstituteAndAccessDetailsFieldTypes;
  instituteTypes: string[];
  lmsTypes: string[];
  status: string[];
  contactDetails: ContactDetailsFieldTypes;
  savingDetails: boolean;
  handleInstituteTypeSelect: (option: string) => void;
  handleLmsTypeSelect: (option: string) => void;
  handleStatusSelect: (option: string) => void;
  handleInstituteDetailsUpdate: (key: string, value: string) => void;
  handleContactDetailsUpdate: (key: string, value: string) => void;
  handleResetValues: () => void;
  getInstituteDetails: () => void;
  saveLtiInsitute: () => void;
};

const getDetails = async (
  instituteId: string
): Promise<InstituteDetails | null> => {
  let response = await axios.post(`${getLtiInstitute}`, {
    instituteId: instituteId,
  });

  if (response.status === 200) {
    return response.data;
  }

  return null;
};

const saveLtiInstituteDetails = async (payload: SaveLtiInsituteDataType) => {
  try {
    let response = await axios.post(`${saveLtiInstitute}`, { ...payload });

    if (response.status === 200) {
      message.success("Data saved successfully");
      useAddInstituteStore.setState({
        savingDetails: false,
      });
    }
  } catch (err) {
    message.error("Failed to save data");
    useAddInstituteStore.setState({
      savingDetails: false,
    });
  }
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
          value: " ",
          label: "Invoke Url",
          placeholder: "Please enter Invoke Url",
          hasError: false,
          errorMsg: "",
        },
        launchUrl: {
          value: " ",
          label: "Launch Url",
          placeholder: "Please enter launch Url",
          hasError: false,
          errorMsg: "",
        },
        apiAccessUrl: {
          value: " ",
          label: "Api Access URL",
          placeholder: "Please enter api access url",
          hasError: false,
          errorMsg: "",
        },
        instituteName: {
          value: " ",
          label: "Institute Name",
          placeholder: "Please enter institute name",
          hasError: false,
          errorMsg: "",
        },
        campusName: {
          value: " ",
          label: "Campus Name",
          placeholder: "Please enter campus name",
          hasError: false,
          errorMsg: "",
        },
        instituteUrl: {
          value: " ",
          label: "Institute Url",
          placeholder: "Please enter institute url",
          hasError: false,
          errorMsg: "",
        },
        token: {
          value: " ",
          label: "Token",
          placeholder: "Please enter token",
          hasError: false,
          errorMsg: "",
        },
        config: {
          value: " ",
          label: "Configurtion",
          placeholder: "Please enter configuration",
          hasError: false,
          errorMsg: "",
        },
        secret: {
          value: " ",
          label: "Secret",
          placeholder: "Please enter secret code",
          hasError: false,
          errorMsg: "",
        },
        accId: {
          value: " ",
          label: "Account Id",
          placeholder: "Please enter account id",
          hasError: false,
          errorMsg: "",
        },
        cliendId: {
          value: " ",
          label: "Client Id",
          placeholder: "Please enter client id",
          hasError: false,
          errorMsg: "",
        },
        xmlUrl: {
          value: " ",
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
      lmsTypes: [
        "Select lms type",
        "Canvas",
        "Black Board",
        "Moodle",
        "D2L",
        "Sakai",
        "Others",
      ],
      status: ["Select status", "Active", "Inactive"],
      savingDetails: false,
      contactDetails: {
        firstName: {
          value: " ",
          label: "First Name",
          placeholder: "Please enter first name",
          hasError: false,
          errorMsg: "",
        },
        lastName: {
          value: " ",
          label: "Last Name",
          placeholder: "Please enter last name",
          hasError: false,
          errorMsg: "",
        },
        email: {
          value: " ",
          label: "Email",
          placeholder: "Please enter your email",
          hasError: false,
          errorMsg: "",
        },
        phone: {
          value: " ",
          label: "Phone",
          placeholder: "Please enter phone number",
          hasError: false,
          errorMsg: "",
        },
        firstAddress: {
          value: " ",
          label: "Address 1",
          placeholder: "Please enter address 1",
          hasError: false,
          errorMsg: "",
        },
        secondAddress: {
          value: " ",
          label: "Address 2",
          placeholder: "Please enter address 2",
          hasError: false,
          errorMsg: "",
        },
        city: {
          value: " ",
          label: "City",
          placeholder: "Please enter city",
          hasError: false,
          errorMsg: "",
        },
        state: {
          value: " ",
          label: "State",
          placeholder: "Please enter state",
          hasError: false,
          errorMsg: "",
        },
        zip: {
          value: " ",
          label: "Zip",
          placeholder: "Please enter zip code",
          hasError: false,
          errorMsg: "",
        },
        country: {
          value: " ",
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
          ...get().contactDetails[key as keyof ContactDetailsFieldTypes],
        };
        option.value = value;
        set({
          contactDetails: {
            ...get().contactDetails,
            [key]: option,
          },
        });
      },
      handleResetValues: () => {
        let instituteAndAccessDetails: InstituteAndAccessDetailsFieldTypes = {
          ...get().instituteAndAccessDetails,
        };
        let contactDetails: ContactDetailsFieldTypes = {
          ...get().contactDetails,
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
          contactDetails: { ...contactDetails },
        });
      },
      getInstituteDetails: async () => {
        const { tokenData } = useAppStore.getState();
        let details: InstituteDetails | null = await getDetails(
          tokenData.instituteId as string
        );

        if (details) {
          const instituteAndAccessDetails = {
            ...get().instituteAndAccessDetails,
          };
          const contactDetails = { ...get().contactDetails };
          instituteAndAccessDetails.accId.value = details.accountId as string;
          instituteAndAccessDetails.apiAccessUrl.value =
            details.lmsAccessurl as string;
          instituteAndAccessDetails.campusName.value =
            details.campusName as string;
          instituteAndAccessDetails.cliendId.value =
            details.ltiClientid as string;
          instituteAndAccessDetails.config.value =
            details.configurationKey as string;
          instituteAndAccessDetails.instituteName.value = details.instituteName;
          instituteAndAccessDetails.instituteType.value =
            details.instituteType as string;
          instituteAndAccessDetails.instituteUrl.value = details.instituteUrl;
          instituteAndAccessDetails.invokeUrl.value = details.invokeUrl;
          instituteAndAccessDetails.launchUrl.value = details.launchUrl;
          instituteAndAccessDetails.lmsType.value = details.lmsName;
          instituteAndAccessDetails.secret.value =
            details.sharedSecret as string;
          instituteAndAccessDetails.status.value = details.status.toString();
          instituteAndAccessDetails.token.value = details.lmsToken;
          instituteAndAccessDetails.xmlUrl.value = details.ltiXmlurl as string;

          contactDetails.city.value = details.city;
          contactDetails.country.value = details.country;
          contactDetails.firstAddress.value = details.address1;
          contactDetails.secondAddress.value = details.address2 as string;
          contactDetails.firstName.value = details.firstName;
          contactDetails.lastName.value = details.contactLastname;
          contactDetails.state.value = details.state;
          contactDetails.zip.value = details.zip;

          set({
            contactDetails: contactDetails,
            instituteAndAccessDetails: instituteAndAccessDetails,
          });
        }
      },
      saveLtiInsitute: async () => {
        set({
          savingDetails: true,
        });
        const instituteAndAccessDetails = {
          ...get().instituteAndAccessDetails,
        };
        const contactDetails = { ...get().contactDetails };
        const { tokenData } = useAppStore.getState();

        let payload: SaveLtiInsituteDataType = {
          instituteId: parseInt(tokenData.instituteId as string),
          lmsName: instituteAndAccessDetails.lmsType.value,
          launchUrl: instituteAndAccessDetails.launchUrl.value,
          lmsToken: instituteAndAccessDetails.token.value,
          status: 1,
          invokeUrl: instituteAndAccessDetails.invokeUrl.value,
          lmsAccessurl: instituteAndAccessDetails.apiAccessUrl.value,
          instituteName: instituteAndAccessDetails.instituteName.value,
          campusName: instituteAndAccessDetails.campusName.value,
          updatedBy: "",
          instituteType: instituteAndAccessDetails.instituteType.value,
          instituteUrl: instituteAndAccessDetails.instituteUrl.value,
          lmsVersion: "",
          accountId: instituteAndAccessDetails.accId.value,
          developersKey: "",
          configurationKey: instituteAndAccessDetails.config.value,
          sharedSecret: instituteAndAccessDetails.secret.value,
          ltiClientid: instituteAndAccessDetails.cliendId.value,
          ltiXml: "",
          ltiXmlurl: instituteAndAccessDetails.xmlUrl.value,
          firstName: contactDetails.firstName.value,
          contactLastname: contactDetails.lastName.value,
          contactPhone: contactDetails.phone.value,
          fax: "",
          address1: contactDetails.firstAddress.value,
          address2: contactDetails.secondAddress.value,
          city: contactDetails.city.value,
          state: contactDetails.state.value,
          zip: contactDetails.zip.value,
          country: contactDetails.country.value,
          createUser: "",
          createDate: "",
          modifyUser: "",
          modifyDate: "",
        };

        await saveLtiInstituteDetails(payload);
      },
    }),
    { name: "Add Institute Store" }
  )
);
