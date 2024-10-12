import { NextFunction, Request, Response } from 'express'
import { validateToken } from '../utils/externalPackages/jsonwebtoken'

// to validate user
const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let authToken: string | undefined
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      authToken = req.headers.authorization.split(' ')[1]
    }
    if (!authToken) {
      throw new Error('token missing')
    }

    let tokenValidation: any = await validateToken({ token: authToken })
    if (!Object?.keys(tokenValidation)?.length || tokenValidation === false) {
      throw new Error('invalid token')
    }
    if (tokenValidation?._id) {
      req['body']['userId'] = tokenValidation?._id
    }

    return next()
  } catch (error) {
    console.error('error at function validateUser :', error?.message ?? error)
    return res.status(401).send({
      status: false,
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
    })
  }
}

export { validateUser }
