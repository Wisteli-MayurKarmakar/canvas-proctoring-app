import { Socket } from "socket.io-client";

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

type AssignmentConfiguration = QuizConfiguration;

type defualtProctingSettings = {
  name: string;
  configName: string;
  infoMsg: string;
  settings: QuizConfigurationWithOnlyProcOpt;
};

type QuizConfiguration = {
  idInstructor?: string;
  assignmentId: number;
  calculatorAllowed: boolean;
  cellPhone: boolean;
  chat: boolean;
  courseId: string;
  createDate: string;
  createUser: string;
  disableCopyPaste: boolean;
  disablePrinting: boolean;
  examdLiveLaunch: boolean;
  examdProctored: boolean;
  guid: string;
  idLtiCanvasConfig: string;
  idUser: string;
  instructorProctored: boolean;
  liveHelp: boolean;
  lockdownBrowser: boolean;
  modifyDate: string;
  modifyUser: string;
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
  timeLimit: number;
  whitelistPages: boolean;
  status?: string;
};

type QuizConfigurationWithOnlyProcOpt = {
  calculatorAllowed: boolean;
  cellPhone: boolean;
  chat: boolean;
  disableCopyPaste: boolean;
  disablePrinting: boolean;
  examdLiveLaunch: boolean;
  examdProctored: boolean;
  instructorProctored: boolean;
  liveHelp: boolean;
  lockdownBrowser: boolean;
  multiplePerson: boolean;
  noPersonInRoom: boolean;
  otp: boolean;
  postExamReview: boolean;
  recordAudio: boolean;
  recordScreen: boolean;
  recordWebcam: boolean;
  roomScan: boolean;
  scratchPadAllowed: boolean;
  speaking: boolean;
  studentIdDl: boolean;
  studentPicture: boolean;
  whitelistPages: boolean;
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
  address1: string;
  address2: string;
  billingCurrency: string;
  billingEmail: string;
  billingId: string;
  billingPhone: string;
  billingRate: number;
  city: string;
  country: string;
  endDate: string;
  firstName: string;
  guid: string;
  instituteId: number;
  lastName: string;
  minNumber: number;
  paymentType: string;
  productType: string;
  startDate: string;
  state: string;
  status: number;
  studentPay: boolean;
  zip: string;
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

//Access record type

type AccessDetails = {
  createUser: string;
  createDate: string;
  modifyUser: string;
  modifyDate: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  key?: string;
  idAccess: string;
  guid: string;
  userId: string;
  instructorId: number;
  instituteId: number;
  accessType: string;
  status: string;
  aiQuiz: string;
  aiWithReport: string;
  liveLaunch: string;
  liveProctor: string;
  lockdownBrowser: string;
};

// Quiz Store

type SampleQuiz = {
  id: string;
  title: string;
  quiz_type: string;
  shuffle_answers: string;
  question_count: string;
  allowed_attempts: string;
  time_limit: 2;
  one_question_at_a_time: string;
  show_correct_answers: string;
  published: string;
  all_dates: [
    {
      due_at: string;
      unlock_at: string;
      lock_at: string;
    }
  ];
};

type GetQuizSchedulePayload = {
  scheduleId: string;
  instituteId: number;
  assignmentId: number;
  quizId: string;
  studentId: string;
  courseId: string;
  scheduleDate: string;
  guid: string;
  status: string;
};

type QuizSchedule = {
  scheduleId: string;
  instituteId: number;
  assignmentId: number;
  quizId: number;
  studentId: number;
  courseId: number;
  guid: string;
  scheduleDate: string;
  status: number;
};

type QuizStore = {
  allQuizzes: Quiz[];
  selectedQuiz?: Quiz;
  sampleQuiz?: SampleQuiz[];
  isConfigAvailable: boolean;
  isAutomatingQuizSetup: boolean;
  selectedQuizSchedule: QuizSchedule[];
  selectedQuizConfig: QuizConfiguration;
  defaultConfiguration: QuizConfigurationWithOnlyProcOpt;
  customizableQuizConfig: QuizConfigurationWithOnlyProcOpt;
  defaultOptionSelected?: string;
  isRecOptions: boolean;
  isVerification: boolean;
  reportReview: boolean;
  liveLaunch: boolean;
  liveProctoring: boolean;
  lockdownBrowser: boolean;
  showConfigSummary: boolean;
  configAvailable: boolean;
  isStudResource: boolean;
  isLockdown: boolean;
  isViolation: boolean;
  isProcExamd: boolean;
  handleConfigCatSelectChange: (category: string) => void;
  handleConfigOptionChange: (category: string, option: string) => void;
  setAllQuizzes: (quizzes: Quiz[]) => void;
  setSelectedQuiz: (quiz: Quiz) => void;
  setDefaultOptionSelection: (optionName: string, flag: boolean) => void;
  updateQuizConfig: (configName: string, selected: boolean) => void;
  handleQuizConfigSelect: (configName: string) => void;
};

type FullNameMap = {
  [key: string]: string;
};

type ConfigurationWithStatus = {
  [key: string]: boolean | string | JSX.Element;
};

type IconMap = {
  [key: string]: JSX.Element;
};

type ConfigurationOptionsWithStatus = ConfigurationWithStatus[];

type GeneralInstructions = {
  name: string;
  infoMsg: string[];
};

type StudentReportAndJourneyDetails = {
  createUser: string;
  createDate: string;
  modifyUser: string;
  modifyDate: string;
  idLtiVideoRef: string;
  idUser: string;
  idReference: string;
  idExam: string;
  courseId: string;
  examDate: string;
  examActualStartTime: string;
  examActualEndTime: string;
  passFail: string;
  status: string;
  guid: string;
  scheduleDate: string;
  key?: string;
  violationCount: number;
  comments: string;
};

type ChatMessage = {
  isStudent: boolean;
  message: string;
  timestamp: string;
};

type ChatStore = {
  createConnection: (roomName: string, userName: string) => void;
  studentDisconnected: boolean;
  instructorDisconnected: boolean;
  recievedMsg: ChatMessage[];
  sentMsg: ChatMessage[];
  socketInstance: Socket<ClientToServerEvents, ServerToClientEvents> | null;
  sendMessage: (
    roomName: string,
    messageType: string,
    msgToSend: ChatMessage
  ) => void;
};

type ViolationMessage = {
  message: string[];
  timestamp: string;
}

type AssessmentViolationStore = {
  studentId: string;
  count: number;
  roomName: string;
  userName: string;
  messages?: ViolationMessage;
  setStudentId: (studentId: string) => void;
  setMessages: (messages: ViolationMessage) => void;
};

export type {
  AllDates,
  Quiz,
  AppStore,
  ViolationMessage,
  AssessmentViolationStore,
  ConfigurationWithStatus,
  ConfigurationOptionsWithStatus,
  ConsumptionTableColumns,
  NotificationType,
  PaymentsTableColumns,
  AccessDetails,
  ChatMessage,
  ChatStore,
  StudentReportAndJourneyDetails,
  IconMap,
  FullNameMap,
  PaymentRecords,
  StudentDetails,
  QuizConfiguration,
  QuizConfigurationWithOnlyProcOpt,
  GetQuizSchedulePayload,
  QuizSchedule,
  StudentJourneyStore,
  SaveLtiInsituteDataType,
  AdminTableDataTypes,
  GeneralInstructions,
  InstructorTableDataTypes,
  NotificationFormFieldType,
  ProctorJourneyStore,
  NotificationStore,
  InstituteDetails,
  QuizStore,
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
