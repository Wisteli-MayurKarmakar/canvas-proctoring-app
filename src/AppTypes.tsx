import { Moment } from "moment";
import { type } from "os";

type AllDates = {
  due_at: string;
  lock_at: string;
  unlock_at: string;
};

type Quiz = {
  all_dates: AllDates[];
  allowed_attempts: string;
  id: string;
  question_count: string;
  quiz_type: string;
  shuffle_answers: string;
  time_limit: number;
  title: string;
};

type Assignment = {
  id: number;
  name: string;
  due_at: string;
  lock_at: string;
  unlock_at: string;
  allowed_attempts: number;
  question_count: number;
  time_limit: number;
  studentAuthed: boolean;
};

type QuizTypeProctoringByQuiz = {
  allowed_attempts?: number;
  due_at?: string;
  id?: number;
  lock_at?: string;
  question_count?: number;
  quiz_type?: string;
  shuffle_answers?: string;
  time_limit?: number;
  title?: string;
  unlock_at?: string;
  assignment_id?: string;
};

type AuthenticationData = {
  instituteId?: string;
  invokeUrl?: string;
  launchUrl?: string;
  lmsAccessToken?: string;
  lmsAccessurl?: string;
  lmsName?: string;
  status?: number;
};

type URLParamsData = {
  courseId?: string;
  userId?: string;
  studentId?: string;
  accountId?: string;
  guid?: string;
  invokeUrl?: string;
  isAuthed?: boolean;
  assignmentId?: string;
  newTab?: boolean;
  loginId?: string;
};

type AssignmentConfiguration = {
  assignmentId: number;
  availableFrom: string;
  availableUntil: string;
  calculatorAllowed: boolean;
  cellPhone: boolean;
  chat: boolean;
  courseId: string;
  disableCopyPaste: boolean;
  disablePrinting: boolean;
  dueDate: string;
  examdLiveLaunch: boolean;
  examdProctored: boolean;
  idLtiCanvasConfig: string;
  idUser: string;
  instructorProctored: false;
  liveHelp: boolean;
  lockdownBrowser: boolean;
  moduleId: number;
  multiplePerson: boolean;
  noPersonInRoom: boolean;
  otp: boolean;
  postExamReview: boolean;
  quizId: string;
  recordAudio: boolean;
  recordScreen: boolean;
  recordWebcam: boolean;
  roomScan: boolean;
  scratchPadAllowed: boolean;
  speaking: boolean;
  studentIdDl: boolean;
  studentPicture: boolean;
  toolConsumerInstanceGuid: string;
  whitelistPages: boolean;
};

type defualtProctingSettings = {
  name: string;
  infoMsg: string;
  settings: QuizConfig;
};

type QuizConfig = {
  recordWebcam: boolean;
  recordScreen: boolean;
  recordAudio: boolean;
  chat: boolean;
  studentPicture: boolean;
  studentIdDl: boolean;
  roomScan: boolean;
  otp: boolean;
  calculatorAllowed: boolean;
  scratchPadAllowed: boolean;
  liveHelp: boolean;
  whitelistPages: boolean;
  disableCopyPaste: boolean;
  disablePrinting: boolean;
  multiplePerson: boolean;
  cellPhone: boolean;
  noPersonInRoom: boolean;
  speaking: boolean;
  postExamReview: boolean;
  examdLiveLaunch: boolean;
  instructorProctored: boolean;
  examdProctored: boolean;
  lockdownBrowser: boolean;
};

type AppStore = {
  loadPage?: string;
  urlParamsData: {
    courseId: string;
    quizId: string;
    userId: string;
    studentId: string;
    accountId: string;
    guid: string;
    invokeUrl: string;
    isAuthed: boolean;
    assignmentId: string;
    newTab: boolean;
    loginId: string;
  };
  tokenData: {
    instituteId?: string;
    invokeUrl?: string;
    launchUrl?: string;
    lmsAccessToken?: string;
    lmsAccessurl?: string;
    lmsName?: string;
    status?: number;
    access_token?: string;
  };
  setTokenData: (data: AuthenticationData) => void;
  setUrlParamsData: (data: URLParamsData) => void;
};

//Add Institute Types

type AddInsitutePropertyTypes = {
  value: string;
  label: string;
  placeholder: string;
  hasError: boolean;
  errorMsg: string;
};

type InstituteAndAccessDetailsFieldTypes = {
  instituteType: AddInsitutePropertyTypes;
  lmsType: AddInsitutePropertyTypes;
  status: AddInsitutePropertyTypes;
  invokeUrl: AddInsitutePropertyTypes;
  launchUrl: AddInsitutePropertyTypes;
  apiAccessUrl: AddInsitutePropertyTypes;
  instituteName: AddInsitutePropertyTypes;
  campusName: AddInsitutePropertyTypes;
  instituteUrl: AddInsitutePropertyTypes;
  token: AddInsitutePropertyTypes;
  config: AddInsitutePropertyTypes;
  secret: AddInsitutePropertyTypes;
  accId: AddInsitutePropertyTypes;
  cliendId: AddInsitutePropertyTypes;
  xmlUrl: AddInsitutePropertyTypes;
};

type ContactDetailsFieldTypes = {
  firstName: AddInsitutePropertyTypes;
  lastName: AddInsitutePropertyTypes;
  email: AddInsitutePropertyTypes;
  phone: AddInsitutePropertyTypes;
  firstAddress: AddInsitutePropertyTypes;
  secondAddress: AddInsitutePropertyTypes;
  city: AddInsitutePropertyTypes;
  state: AddInsitutePropertyTypes;
  zip: AddInsitutePropertyTypes;
  country: AddInsitutePropertyTypes;
};

//Add Billing Types
type AddBillingPropertyTypes = {
  value: string;
  label: string;
  placeholder: string;
  hasError: boolean;
  errorMsg: string;
};

type ServicesAndBillingFieldTypes = {
  productType: AddBillingPropertyTypes;
  supportType: AddBillingPropertyTypes;
  studentsProctorType: AddBillingPropertyTypes;
  status: AddBillingPropertyTypes;
  reportReview: AddBillingPropertyTypes;
  studentPay: AddBillingPropertyTypes;
  paymentType: AddBillingPropertyTypes;
  billCurrency: AddBillingPropertyTypes;
  billRate: AddBillingPropertyTypes;
  minQuiz: AddBillingPropertyTypes;
  startDate: AddBillingPropertyTypes;
  endDate: AddBillingPropertyTypes;
};

type BillingContactDetails = {
  firstName: AddBillingPropertyTypes;
  lastName: AddBillingPropertyTypes;
  email: AddBillingPropertyTypes;
  phone: AddBillingPropertyTypes;
  firstAddress: AddBillingPropertyTypes;
  secondAddress: AddBillingPropertyTypes;
  city: AddBillingPropertyTypes;
  state: AddBillingPropertyTypes;
  zip: AddBillingPropertyTypes;
  country: AddBillingPropertyTypes;
};

type CouseDetails = {
  account_id: string;
  id: string;
  name: string;
  start_at: string;
  uuid: string;
};

type FormRequiredFieldRules = {
  required: boolean;
  message: string;
};

type PastRecordTableColumns = {
  dataIndex: string;
  key: string;
  title: string;
  render?: (row: any) => void;
};

//Course Details
type CourseDetails = {
  account_id: string;
  id: string;
  name: string;
  start_at: string;
  uuid: string;
};

//Socket.io server types

type UserValidationData = {
  evt: string;
  room: string;
  user: string;
};

type ChatData = {
  evt: string;
  room: string;
  text: string;
};

type ClientToServerEvents = {
  hello: () => void;
  chat: (data: any) => void;
};

type ServerToClientEvents = {
  validate: (validationData: UserValidationData) => void;
  chat: (data: ChatData) => void;
};

// Billing data type

type BillingData = {
  billingId?: string;
  guid: string;
  instituteId: number;
  billingTier?: string;
  minNumber: number;
  productType: string;
  billingEmail: string;
  studentPay: string;
  paymentType: string;
  billingRate: number;
  billingCurrency: string;
  startDate: string;
  endDate: string;
  status?: number;
};

type StudentDetails = {
  idLtiStudentProfile: string;
  guid: string;
  idUser: string;
  firstName: string;
  lastName: string;
  email: string;
  idFileIndex1: string;
  idFileIndex2: string;
  idFileName1: string;
  idFileName2: string;
  status: number;
  createUser: string | null;
  createDate: string;
  modifyUser: string | null;
  modifyDate: string | null;
};

//Payments Type

type PaymentStoreType = {
  providers: string[];
  selectedProvider: string;
  billingEmail: string;
  userDetails: StudentDetails;
  message: string;
  firstName: string;
  lastName: string;
  email: string;
  setBillingEmail: (value: string) => void;
  setProvider: (value: string) => void;
  setMessage: (value: string) => void;
  setUserDetails: () => void;
};

//Student Journey

type StudentJourney = {
  ltiStudentJourneyId?: string;
  guid: string;
  studentId: number;
  assignmentId: number;
  quizId: number;
  status: number;
  systemCheck: boolean;
  privacyCheck: boolean;
  examRules: boolean;
  cameraAccess: boolean;
  microphoneAccess: boolean;
  screenShare: boolean;
  assignmentSubmitted: boolean;
  quizSubmitted: boolean;
  courseId: number;
};

type StudentJourneyStore = {
  journeyDetails: StudentJourney;
  getJourneyDetails: () => void;
  setJourneyDetails: (stepName: string) => void;
};

//Procotor Journey

type ProctorJourney = {
  ltiProctorJourneyId?: string;
  guid: string;
  studentId: number;
  proctorId: number;
  quizId: number;
  proctorUser: string;
  authenticatedBy: string;
  reportReviwer: string;
  status: number;
  aiAuthentication: boolean;
  reportReviwed: boolean;
  reportPass: boolean;
  courseId: number;
};

type ProctorJourneyStore = {
  journeyDetails?: ProctorJourney | null;
  getJourneyDetails: (studentId: string) => void;
  setJourneyDetails: (
    stepName: string,
    studentId: string,
    quizId: string
  ) => void;
};

// Student Quiz Report

type StudentQuizReport = {
  [key: string]: {
    [key: string]: {
      resultPass: boolean;
      reportReviwed: boolean;
    };
  };
};

//Payment Details

type PaymentDetails = {
  idPayment?: string;
  guid: string;
  provider: string;
  paymentDate: string;
  paymentAmount: number;
  payerId: string;
  primaryEmail: string;
  billingEmail: string;
  paymentReferenceNumber: string;
  status: number;
};

//Consumption Details

type ConsumptionDetails = {
  idConsumption?: string;
  guid: string;
  emailId: string;
  userId: string;
  courseId: number;
  quizId: number;
  productType: string;
  durationInMins: number;
  interactionDate: string;
  status: number;
};

//Consumption table columns

type ConsumptionTableColumns = {
  dataIndex: string;
  key: string;
  title: string;
};

type ConsumptionRecord = {
  idConsumption: string;
  guid: string;
  emailId: string;
  userId: string;
  courseId: number;
  quizId: number;
  productType: string;
  durationInMins: number;
  interactionDate: string;
  status: number;
  key?: number;
};

//Payments Table columns
type PaymentsTableColumns = {
  dataIndex: string;
  key: string;
  title: string;
};

type PaymentRecords = {
  idPayment: string;
  guid: string;
  provider: string;
  paymentDate: string;
  paymentAmount: number;
  payerId: string;
  primaryEmail: string;
  billingEmail: string;
  paymentReferenceNumber: string;
  status: number;
  key?: number;
};

//Notification form field types

type NotificationFormFieldType = {
  value: string | boolean;
  hasError: boolean;
};

// Notification Types

type NotificationType = {
  [key: string]: string;
};

//Notification type
type NotificationStore = {
  allSources: string[];
  allTopics: NotificationType | null;
  allStatus: string[];
  allPreferences: string[];
  defualtEmailTemplate: string;
  selectedSource: NotificationFormFieldType;
  selectedTopic: NotificationFormFieldType;
  selectedStatus: NotificationFormFieldType;
  selectedPreferences: NotificationFormFieldType;
  testMessage: boolean;
  message: string;
  loadingTopic: boolean;
  savingNotification: boolean;
  getNotificationData: () => void;
  updateNotificationData: (key: string, value: string | boolean) => void;
  reset: () => void;
  saveNotification: () => void;
};

// Institute Details
type InstituteDetails = {
  instituteId: number;
  invokeUrl: string;
  lmsName: string;
  instituteName: string;
  campusName?: string;
  updatedBy?: string;
  instituteType?: string;
  instituteUrl: string;
  lmsVersion?: string;
  accountId?: string;
  launchUrl: string;
  developersKey?: string;
  lmsToken: string;
  configurationKey?: string;
  sharedSecret?: string;
  ltiClientid?: string;
  ltiXml?: string;
  ltiXmlurl?: string;
  status: number;
  firstName: string;
  contactLastname: string;
  contactPhone: string;
  fax?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  lmsAccessurl: string;
  createUser: string;
  createDate: string;
  modifyUser: string;
  modifyDate: string;
};

// Save LTI Institute

type SaveLtiInsituteDataType = {
  instituteId: number;
  lmsName: string;
  launchUrl: string;
  lmsToken: string;
  status: number;
  invokeUrl: string;
  lmsAccessurl: string;
  instituteName: string;
  campusName: string;
  updatedBy: string;
  instituteType: string;
  instituteUrl: string;
  lmsVersion: string;
  accountId: string;
  developersKey: string;
  configurationKey: string;
  sharedSecret: string;
  ltiClientid: string;
  ltiXml: string;
  ltiXmlurl: string;
  firstName: string;
  contactLastname: string;
  contactPhone: string;
  fax: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  createUser: string;
  createDate: string;
  modifyUser: string;
  modifyDate: string;
};

// Access Tab - Admin table column types --------->

//Admin Table Column Types

type AdminTableDataTypes = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createDate: string;
};

type InstructorTableDataTypes = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  ai: JSX.Element;
  aiWRep: JSX.Element;
  launch: JSX.Element;
  proctoring: JSX.Element;
  lockdown: JSX.Element;
};

export type {
  AllDates,
  Quiz,
  AppStore,
  QuizConfig,
  ConsumptionTableColumns,
  NotificationType,
  PaymentsTableColumns,
  PaymentRecords,
  StudentDetails,
  StudentJourneyStore,
  SaveLtiInsituteDataType,
  AdminTableDataTypes,
  InstructorTableDataTypes,
  NotificationFormFieldType,
  ProctorJourneyStore,
  NotificationStore,
  InstituteDetails,
  AssignmentConfiguration,
  ConsumptionRecord,
  PaymentDetails,
  ConsumptionDetails,
  StudentQuizReport,
  ProctorJourney,
  StudentJourney,
  ServerToClientEvents,
  ClientToServerEvents,
  defualtProctingSettings,
  PaymentStoreType,
  ContactDetailsFieldTypes,
  InstituteAndAccessDetailsFieldTypes,
  AddInsitutePropertyTypes,
  AddBillingPropertyTypes,
  ServicesAndBillingFieldTypes,
  BillingContactDetails,
  FormRequiredFieldRules,
  PastRecordTableColumns,
  QuizTypeProctoringByQuiz,
  CourseDetails,
  CouseDetails,
  BillingData,
  Assignment,
};
