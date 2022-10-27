import produce from "immer";
import create from "zustand";
import { devtools } from "zustand/middleware";

type Authentication = {
  instituteId?: number;
  lmsName?: string;
  launchUrl?: string;
  lmsAccessToken?: string;
  invokeUrl?: string;
  status?: number;
  lmsAccessurl?: string;
};

type AuthenticationStore = {
  authenticationData?: Authentication;
  setAuthenticationData: (data: Authentication) => void;
};

export const userAuthenticationStore = create<AuthenticationStore>()(
  devtools(
    (set) => ({
      setAuthenticationData: (data: Authentication) =>
        set(
          produce((draft) => {
            draft.authenticationData = data;
          })
        ),
    }),
    { name: "AuthenticationStore" }
  )
);
