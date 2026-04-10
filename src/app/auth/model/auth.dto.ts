export type SignInRequestDto = {
  email: string
  password: string
}

export type SignInResponseDto = {
  userId: number
  fullname: string
  email: string
  token: string
}

export type SignUpRequestDto = {
  fullname: string
  email: string
  password: string
}

export type SignUpResponseDto = {
  message: string
}
