import { Schema, Types, model } from 'mongoose'

interface IUser {
  _id?: Types.ObjectId
  name: string
  email: string
  password: string
  age?: number
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  age: Number,
})

const User = model<IUser>('User', userSchema)

export default User

export { IUser }
