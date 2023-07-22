import { ESmsActions } from "../enums/sms.enum";

export const smsTemplates = {
  [ESmsActions.WELCOME]: {
    templateName: "register",
    subject: "Welcome to our school ",
  },
  [ESmsActions.ACTIVATED]: {
    templateName: "activated",
    subject: "Please activated your account ",
  },
};
