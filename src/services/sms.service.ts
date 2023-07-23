// import { Twilio } from "twilio";
//
// import { configs } from "../configs/config";
// import { smsTemplates } from "../constants/sms.constant";
// import { ESmsActions } from "../enums/sms.enum";
//
// class SmsService {
//   constructor(
//     private client = new Twilio(
//       configs.TWILIO_ACCOUNT_SID,
//       configs.TWILIO_TOKEN
//     )
//   ) {}
//
//   public async sendSms(phone: string, action: ESmsActions) {
//     try {
//       const template = smsTemplates[action].templateName;
//       await this.client.messages.create({
//         body: template,
//         messagingServiceSid: configs.TWILIO_SERVICE_SID,
//         to: phone,
//       });
//     } catch (err) {
//       console.log(err.message);
//     }
//   }
// }
//
// export const smsService = new SmsService();
