"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminSession } from "../hooks/use-admin-session.hook"
import { loginWithCredentials } from "../services/auth.service"
import { LoginErrorCode } from "../enums/login-error-code.enum"
import styles from "../styles/login.style.module.css"

const ERROR_MESSAGES: Record<LoginErrorCode, string> = {
    [LoginErrorCode.NONE]: "",
    [LoginErrorCode.WRONG_CREDENTIALS]: "Correo o contraseña incorrectos",
    [LoginErrorCode.INACTIVE_ACCOUNT]: "Tu cuenta está inactiva",
    [LoginErrorCode.UNKNOWN]: "Ocurrió un error. Intenta de nuevo",
}

export function LoginContainer() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { login } = useAdminSession()
    const router = useRouter()

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value)
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value)
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        setErrorMessage("")

        const hasEmail = Boolean(email.trim())
        const hasPassword = Boolean(password.trim())
        const isFormValid = hasEmail && hasPassword
        if (!isFormValid) {
            setErrorMessage("Completa todos los campos")
            return
        }

        setIsLoading(true)
        const result = await loginWithCredentials(email.trim(), password)
        setIsLoading(false)

        const isSuccess = result.errorCode === LoginErrorCode.NONE
        if (isSuccess) {
            login(result.tokenPair, result.profile)
            router.replace("/dashboard")
            return
        }

        setErrorMessage(ERROR_MESSAGES[result.errorCode])
    }

    const hasError = Boolean(errorMessage)

    return (
        <main className={styles.loginPage}>
            <section className={styles.loginCard}>
                <h1 className={styles.loginTitle}>BigBoss</h1>
                <p className={styles.loginSubtitle}>Back Office</p>
                <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
                    <div className={styles.loginField}>
                        <label htmlFor="email" className={styles.loginLabel}>
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            data-testid="email-input"
                            type="email"
                            className={styles.loginInput}
                            value={email}
                            onChange={handleEmailChange}
                            autoComplete="email"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className={styles.loginField}>
                        <label htmlFor="password" className={styles.loginLabel}>
                            Contraseña
                        </label>
                        <input
                            id="password"
                            data-testid="password-input"
                            type="password"
                            className={styles.loginInput}
                            value={password}
                            onChange={handlePasswordChange}
                            autoComplete="current-password"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {hasError && (
                        <p
                            data-testid="login-error"
                            className={styles.loginError}
                            role="alert"
                        >
                            {errorMessage}
                        </p>
                    )}
                    <button
                        data-testid="login-button"
                        type="submit"
                        className={styles.loginButton}
                        disabled={isLoading}
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <span className={styles.loginSpinner} />
                        ) : (
                            "Iniciar sesión"
                        )}
                    </button>
                </form>
            </section>
        </main>
    )
}
