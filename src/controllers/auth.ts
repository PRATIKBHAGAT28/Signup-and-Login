import { NextFunction, Request, Response } from "express";
import Model from "../modules/auth";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Model.login(req.body);
    if (result?.status == false) {
      throw result?.message;
    }
    return res.status(200).json(result ?? {});
  } catch (error) {
    console.error("error at function login :", error?.message ?? error);
    next(error?.message ?? error);
    return
  }
};
const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Model.signup(req.body);
    if (result?.status == false) {
      throw result?.message;
    }
    return res.status(200).json(result ?? {});
  } catch (error) {
    console.error("error at function signup :", error?.message ?? error);
    next(error?.message ?? error);
    return
  }
};



export default { login, signup };
