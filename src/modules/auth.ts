import { signToken } from '../utils/externalPackages/jsonwebtoken'
import User, { IUser } from '../utils/db/models/user'
import { fromZodError, zod } from '../utils/externalPackages/zod'

var bcrypt = require('bcryptjs')

// log in schema
const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
})

type loginType = zod.infer<typeof loginSchema>

// login
const login = async (tData: loginType) => {
  try {
    const validationResult = loginSchema?.safeParse(tData)
    if (!validationResult?.success) {
      const validationError = fromZodError(validationResult?.error)?.toString()
      throw new Error(validationError)
    }
    console.log('login', JSON.stringify(tData))

    const validatedData = validationResult?.data
    const { email, password } = validatedData
    const {} = tData
    let user: IUser | null = await User.findOne({ email }).select({
      email: 1,
      name: 1,
      password: 1,
      age: 1,
    })
    if (!user) {
      throw new Error('User not exist')
    }
    console.log('user', user)

    let isPasswordMatching = await bcrypt.compare(password, user?.password)
    if (isPasswordMatching === false) {
      throw new Error('password not matching')
    }
    let userInfo = {
      email: user?.email,
      name: user?.name,
      age: user?.age,
      _id: user?._id,
    }

    const token = await signToken({
      data: userInfo,
    })

    return {
      status: true,
      message: 'success',
      data: {
        ...userInfo,
        token,
      },
    }
  } catch (error) {
    console.error('error at function login :', error?.message ?? error)
    return {
      status: false,
      message: error?.message ?? 'fail',
    }
  }
}

// Sign up Schema

const signupSchema = zod
  .object({
    email: zod.string().email(),
    password: zod.string(),
    confirmPassword: zod.string(),
    name: zod.string(),
    age: zod.coerce.number(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // path of error
  })

type signupType = zod.infer<typeof signupSchema>

// sign up
const signup = async (tData: signupType) => {
  try {
    const validationResult = signupSchema?.safeParse(tData)
    if (!validationResult?.success) {
      const validationError = fromZodError(validationResult?.error)?.toString()
      throw new Error(validationError)
    }

    const validatedData = validationResult?.data
    const { email, password, name, age } = validatedData
    const {} = tData

    let user: IUser | null = await User.findOne({ email })
    if (user) {
      throw new Error('User already exist')
    }
    let hassedPassword = await bcrypt.hash(password, 8)
    const newUser: IUser = {
      name,
      age,
      password: hassedPassword,
      email,
    }
    const createdUser: IUser = await User.create(newUser)

    return {
      status: true,
      message: 'success',
      data: createdUser,
    }
  } catch (error) {
    console.error('error at function signup :', error?.message ?? error)
    return {
      status: false,
      message: error?.message ?? 'fail',
    }
  }
}

export default { login, signup }
