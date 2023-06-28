import { CronJob } from "cron";
import dayjs from "dayjs";
import uts from "dayjs/plugin/utc";

import { OldPassword } from "../models/OldPassword.model";

dayjs.extend(uts);
const passwordRemover = async () => {
  const previousDate = dayjs().utc().subtract(1, "month");
  console.log("delete password");
  await OldPassword.deleteMany({
    createdAt: { $lte: previousDate },
  });
};

export const removeOldPassword = new CronJob(" 0 0 * * * ", passwordRemover);
