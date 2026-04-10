import type { AuthSession, SignInCommand, SignUpCommand, SignUpResult } from '../model/auth'
import type { SignInResponseDto, SignUpResponseDto } from '../model/auth.dto'
import { BaseService } from '../../shared/services/BaseService'
import { AuthAdapter } from './AuthAdapter'

class AuthService extends BaseService {
  constructor() {
    super('/Authentication')
  }

  async signIn(command: SignInCommand): Promise<AuthSession> {
    const payload = AuthAdapter.toSignInRequestDto(command)
    const response = await this.post<SignInResponseDto, typeof payload>(
      '/sign-in',
      payload,
    )

    return AuthAdapter.toAuthSession(response)
  }

  async signUp(command: SignUpCommand): Promise<SignUpResult> {
    const payload = AuthAdapter.toSignUpRequestDto(command)
    const response = await this.post<SignUpResponseDto, typeof payload>(
      '/sign-up',
      payload,
    )

    return AuthAdapter.toSignUpResult(response)
  }
}

export const authService = new AuthService()
