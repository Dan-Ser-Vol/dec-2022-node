import { CronJob } from "cron";
import dayjs from "dayjs";
import uts from "dayjs/plugin/utc";

import { Token } from "../models/Token.model";
import { User } from "../models/User.model";

dayjs.extend(uts);
const tokensRemover = async () => {
  const previousDate = dayjs().utc().subtract(1, "minutes");
  console.log("some time");
  const users = await User.find();
  users.map(async (user) => {
    await Token.deleteMany({
      _userId: user._id,
      createdAt: { $lte: previousDate },
    });
  });
};

export const removeOldTokens = new CronJob(" 0 0 * * *", tokensRemover);
