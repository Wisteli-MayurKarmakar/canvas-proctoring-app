import moment from "moment";
import create from "zustand";
import { devtools } from "zustand/middleware";
import {
  AddBillingPropertyTypes,
  BillingContactDetails,
  ContactDetailsFieldTypes,
  ServicesAndBillingFieldTypes,
} from "../AppTypes";

type BillingStore = {
  productTypes: string[];
  supportTypes: string[];
  studentProctorTypes: string[];
  status: string[];
  reportReviewTypes: string[];
  studentPayTypes: string[];
  paymentTypes: string[];
  billCurrencyTypes: string[];
  minQuizType: string[];
  serviceAndBillingDetails: ServicesAndBillingFieldTypes;
  contactDetails: BillingContactDetails;
  pastRecords: string;
  handleServiceAndBillingDetailsUpdate: (key: string, value: string) => void;
  handleContactDetailsUpdate: (key: string, value: string) => void;
  handleResetValues: () => void;
};

export const useBillingStore = create<BillingStore>()(
  devtools(
    (set, get) => ({
      productTypes: [
        "Select product type",
        "AI",
        "Live Launch",
        "Instructor Proctored",
        "Lockdown Browser",
      ],
      supportTypes: ["Select support type", "Silver", "Gold", "Platinum"],
      studentProctorTypes: [
        "Select student/ proctor",
        "4",
        "6",
        "8",
        "10",
        "12",
        "16",
        "20",
      ],
      status: ["Active", "Inactive"],
      reportReviewTypes: ["Select review type", "Yes", "No"],
      studentPayTypes: ["Select student pay", "Yes", "No"],
      paymentTypes: [
        "Select payment type",
        "Per Quiz/ Student",
        "Per Month/ Student",
        "Per Student/ Year",
        "Per Campus/ Year",
      ],
      billCurrencyTypes: ["Select currency", "Dollar", "Rupees"],
      minQuizType: [
        "Select min. quiz/ month",
        "20",
        "100",
        "500",
        "1000",
        "5000",
        "10000",
        "20000",
      ],
      pastRecords: "",
      serviceAndBillingDetails: {
        productType: {
          value: "Select product type",
          label: "Product Type",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        supportType: {
          value: "Select support type",
          label: "Support Type",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        studentsProctorType: {
          value: "Select student/ Proctor type",
          label: "Student/ Proctor Type",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        status: {
          value: "Active",
          label: "Status",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        reportReview: {
          value: "Yes",
          label: "Review Report",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        studentPay: {
          value: "Select student pay",
          label: "Student Pay",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        paymentType: {
          value: "Select payment type",
          label: "Payment Type",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        billCurrency: {
          value: "Dollar",
          label: "Billing Currency",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        billRate: {
          value: "",
          label: "Billing Rate",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        minQuiz: {
          value: "",
          label: "Min. Quiz/ Month",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        startDate: {
          value: moment().toISOString(),
          label: "Start Date",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
        endDate: {
          value: moment().add(1, "years").toISOString(),
          label: "End Date",
          placeholder: "",
          hasError: false,
          errorMsg: "",
        },
      },
      contactDetails: {
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
          placeholder: "Please enter your phone number",
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
          placeholder: "Please enter your country",
          hasError: false,
          errorMsg: "",
        },
      },
      handleServiceAndBillingDetailsUpdate: (key: string, value: string) => {
        if (key === "productType") {
          let productType: AddBillingPropertyTypes = {
            ...get().serviceAndBillingDetails.productType,
          };
          if (productType.hasError) {
            if (value !== "Select product type") {
              productType.hasError = false;
              productType.errorMsg = "";
              set((state) => ({
                serviceAndBillingDetails: {
                  ...state.serviceAndBillingDetails,
                  productType: { ...productType },
                },
              }));
            }
          }
        }

        if (key === "paymentType") {
          let paymentType: AddBillingPropertyTypes = {
            ...get().serviceAndBillingDetails.paymentType,
          };
          if (paymentType.hasError) {
            if (value !== "Select payment type") {
              paymentType.hasError = false;
              paymentType.errorMsg = "";
              set((state) => ({
                serviceAndBillingDetails: {
                  ...state.serviceAndBillingDetails,
                  paymentType: { ...paymentType },
                },
              }));
            }
          }
        }

        if (key === "studentPay") {
          let studentPay: AddBillingPropertyTypes = {
            ...get().serviceAndBillingDetails.studentPay,
          };
          if (studentPay.hasError) {
            if (value !== "Select student pay") {
              studentPay.hasError = false;
              studentPay.errorMsg = "";
              set((state) => ({
                serviceAndBillingDetails: {
                  ...state.serviceAndBillingDetails,
                  studentPay: { ...studentPay },
                },
              }));
            }
          }
        }

        let option = {
          ...get().serviceAndBillingDetails[
            key as keyof ServicesAndBillingFieldTypes
          ],
        };
        option.value = value;
        set({
          serviceAndBillingDetails: {
            ...get().serviceAndBillingDetails,
            [key]: option,
          },
        });
      },
      handleContactDetailsUpdate: (key: string, value: string) => {
        let option = {
          ...get().contactDetails[key as keyof BillingContactDetails],
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
        let serviceAndBillingDetails: ServicesAndBillingFieldTypes = {
          ...get().serviceAndBillingDetails,
        };
        let contactDetails: ContactDetailsFieldTypes = {
          ...get().contactDetails,
        };
        Object.keys(serviceAndBillingDetails).forEach((key: string) => {
          if (key === "productType") {
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].hasError = false;
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].errorMsg = "";
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].value = "Select product type";
          }
          if (key === "supportType") {
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].hasError = false;
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].errorMsg = "";
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].value = "Select support type";
          }
          if (key === "studentsProctorType") {
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].hasError = false;
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].errorMsg = "";
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].value = "Select student/ Proctor type";
          }
          if (key === "status") {
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].hasError = false;
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].errorMsg = "";
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].value = "Active";
          }
          if (key === "reportReview") {
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].hasError = false;
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].errorMsg = "";
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].value = get().reportReviewTypes[1];
          }
          if (key === "studentPay") {
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].hasError = false;
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].errorMsg = "";
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].value = get().studentPayTypes[0];
          }
          if (key === "paymentType") {
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].hasError = false;
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].errorMsg = "";
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].value = get().paymentTypes[0];
          }
          if (key === "billCurrency") {
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].hasError = false;
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].errorMsg = "";
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].value = get().billCurrencyTypes[1];
          }
          if (key === "minQuiz") {
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].hasError = false;
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].errorMsg = "";
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].value = get().minQuizType[0];
          }
          if (key === "billRate") {
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].hasError = false;
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].errorMsg = "";
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].value = "";
          }
          if (key === "startDate") {
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].hasError = false;
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].errorMsg = "";
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].value = moment().format("MM-DD-YYYY");
          }
          if (key === "endDate") {
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].hasError = false;
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].errorMsg = "";
            serviceAndBillingDetails[
              key as keyof ServicesAndBillingFieldTypes
            ].value = moment().add(1, "days").format("MM-DD-YYYY");
          }
        });
        Object.keys(contactDetails).forEach((key: string) => {
          contactDetails[key as keyof ContactDetailsFieldTypes].hasError =
            false;
          contactDetails[key as keyof ContactDetailsFieldTypes].errorMsg = "";
          contactDetails[key as keyof ContactDetailsFieldTypes].value = "";
        });
        set({
          serviceAndBillingDetails: { ...serviceAndBillingDetails },
        });
      },
    }),
    { name: "Add Billing Store" }
  )
);
