"use client"

import { useState } from "react"
import styles from "../styles/login.style.module.css"
import { EMPTY_TENANT_ADMIN_SESSION } from "../constants/auth.constant"

export function LoginContainer() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value)
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value)
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        setIsLoading(true)
        setErrorMessage("")
        // Login logic wired in next iteration
        setIsLoading(false)
    }

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
                            type="email"
                            className={styles.loginInput}
                            value={email}
                            onChange={handleEmailChange}
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className={styles.loginField}>
                        <label htmlFor="password" className={styles.loginLabel}>
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={styles.loginInput}
                            value={password}
                            onChange={handlePasswordChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    {errorMessage !== "" && (
                        <p className={styles.loginError} role="alert">
                            {errorMessage}
                        </p>
                    )}
                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={isLoading}
                        aria-busy={isLoading}
                    >
                        {isLoading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
            </section>
        </main>
    )
}
