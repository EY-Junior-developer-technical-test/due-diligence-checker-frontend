export type SignInCommand = {
	email: string
	password: string
}

export type SignUpCommand = {
	fullname: string
	email: string
	password: string
}

export type AuthSession = {
	userId: number
	fullname: string
	email: string
	token: string
}

export type SignUpResult = {
	message: string
}
