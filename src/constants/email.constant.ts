import { EEmailActions } from "../enums/email.enum";

export const allTemplates = {
  [EEmailActions.REGISTER]: {
    templateName: "register",
    subject: "Register into our school ",
  },
  [EEmailActions.WELCOME]: {
    templateName: "register",
    subject: "Welcome to our school ",
  },
  [EEmailActions.ACTIVATED]: {
    templateName: "activated",
    subject: "Please activated your account ",
  },
  [EEmailActions.FORGOT_PASSWORD]: {
    templateName: "forgot-password",
    subject: "Please restore your password ",
  },
};
