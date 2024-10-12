import 'dotenv/config'
import * as jwt from 'jsonwebtoken'
import { fromZodError, zod } from './zod'
const { JWT_SECRET_KEY } = process.env

// sign in token schema
const signTokenSchema = zod.object({
  data: zod.object({}),
})

type signTokenType = zod.infer<typeof signTokenSchema>

// sign in token
const signToken = async (tData: signTokenType): Promise<string | undefined> => {
  try {
    const validationResult = signTokenSchema?.safeParse(tData)
    if (!validationResult?.success) {
      const validationError = fromZodError(validationResult?.error)?.toString()
      throw new Error(validationError)
    }

    const validatedData = validationResult?.data
    const {} = validatedData
    const { data = {} } = tData
    const token = jwt.sign(data, JWT_SECRET_KEY)
    return token
  } catch (error) {
    console.error('error at function signToken :', error?.message ?? error)
    return
  }
}

const validateTokenSchema = zod.object({
  token: zod.string(),
})

type validateTokenType = zod.infer<typeof validateTokenSchema>

// vlaidate token
const validateToken = async (
  tData: validateTokenType
): Promise<object | boolean> => {
  try {
    const validationResult = validateTokenSchema?.safeParse(tData)
    if (!validationResult?.success) {
      const validationError = fromZodError(validationResult?.error)?.toString()
      throw new Error(validationError)
    }

    const validatedData = validationResult?.data
    const { token } = validatedData
    const {} = tData

    const verified = jwt.verify(token, JWT_SECRET_KEY)

    if (verified) {
    } else {
      throw new Error('unable to verify')
    }

    return verified
  } catch (error) {
    console.error('error at function validateToken :', error?.message ?? error)
    return false
  }
}

export { signToken, validateToken }
