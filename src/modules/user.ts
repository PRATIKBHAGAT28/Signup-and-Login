import User, { IUser } from "../utils/db/models/user";
import { fromZodError, zod } from "../utils/externalPackages/zod";


const profileSchema = zod.object({
  userId: zod.string(),
});

type profileType = zod.infer<typeof profileSchema>;


const profile = async (tData: profileType) => {
  try {
    const validationResult = profileSchema?.safeParse(tData);
    if (!validationResult?.success) {
      const validationError = fromZodError(validationResult?.error)?.toString();
      throw new Error(validationError);
    }
    console.log("profile", JSON.stringify(tData))

    const validatedData = validationResult?.data;
    const { userId } = validatedData;
    const { } = tData;
    let user: IUser | null = await User.findOne({ _id: userId }).select({ "email": 1, "name": 1, "password": 1, "age": 1 })
    if (!user) {
      throw new Error("User not exist");
    }

    return {
      status: true,
      message: 'success',
      data: user
    };
  } catch (error) {
    console.error('error at function profile :', error?.message ?? error);
    return {
      status: false,
      message: error?.message ?? 'fail',
    };
  }
};

export default { profile, }
