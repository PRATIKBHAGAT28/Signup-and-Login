import { NextFunction, Request, Response } from "express";
import Model from "../modules/user";

const profile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Model.profile(req.body);
    if (result?.status == false) {
      throw result?.message;
    }
    return res.status(200).json(result ?? {});
  } catch (error) {
    console.error("error at function profile :", error?.message ?? error);
    next(error?.message ?? error);
    return
  }
};



export default { profile };
