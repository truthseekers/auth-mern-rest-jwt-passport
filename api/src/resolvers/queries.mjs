import { User } from "../models/User.mjs";
// import mongoose from "mongoose";
//     const userId = new mongoose.Types.ObjectId(args.userId); // this fixes the stupid _id vs id issue.
// Found this in a post music-api app.

const Query = {
  currentUser: async (parent, args, context) => {
    try {
      // This is wrong... there SHOULD be an error when the jwt is expired to get into the catch... But it's not happening.
      const { user } = await context.authenticate("jwt", { session: false });
      // the below block technically isn't right. jwt could be malformed or something.
      if (!user.id) {
        throw Error("jwt is expired");
      }
      // console.log("uhh user crazy: ", user);
      // hmm.user.user.id = hmm.user?.user?._id;
      return user;
    } catch (error) {
      return null;
    }
  },
};

export { Query };
