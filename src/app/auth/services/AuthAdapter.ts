import type {
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
  SignUpResponseDto,
} from '../model/auth.dto'
import type { AuthSession, SignInCommand, SignUpCommand, SignUpResult } from '../model/auth'

export class AuthAdapter {
  static toSignInRequestDto(command: SignInCommand): SignInRequestDto {
    return {
      email: command.email.trim(),
      password: command.password,
    }
  }

  static toSignUpRequestDto(command: SignUpCommand): SignUpRequestDto {
    return {
      fullname: command.fullname.trim(),
      email: command.email.trim(),
      password: command.password,
    }
  }

  static toAuthSession(dto: SignInResponseDto): AuthSession {
    return {
      userId: dto.userId,
      fullname: dto.fullname,
      email: dto.email,
      token: dto.token,
    }
  }

  static toSignUpResult(dto: SignUpResponseDto): SignUpResult {
    return {
      message: dto.message,
    }
  }
}
