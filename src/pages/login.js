import Head from "next/head"
import netflixIcon from '../../public/static/netflix.svg'
import styles from '../styles/Login.module.css'
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/router"
import { magic } from "../../lib/magic-client"
import { useEffect } from "react"


const Login = () => {

    const [userMsg, setUserMsg] = useState('')
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const handleComplete = () => {
            setIsLoading(false)
        }
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    }, [router])

    const handleOnChangeEmail = (e) => {
        setUserMsg('')
        // console.log('event', e.target.value)
        const email = e.target.value
        setEmail(email)
    }

    const handleLogInWithEmail = async (e) => {
        
        e.preventDefault()
        // console.log('btn clicked')

        if (email) {
            // if(email === 'kanuchinaza70@gmail.com') {
                try {
                    setIsLoading(true)
                    const didToken = await magic.auth.loginWithMagicLink({ email });
                    console.log({didToken})
                    if(didToken) {

                        const response = await fetch('/api/login', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${didToken}`,
                                "Content-Type": "application/json"
                            }
                        })
                        const loggedInResponse = await response.json()
                        if (loggedInResponse.done) {
                            console.log({loggedInResponse})
                            router.push('/')
                        } else {
                            setIsLoading(false)
                            setUserMsg('Something went wrong logging in')
                        }
                    }
                } catch(err) {
                    // Handle errors if required!
                    console.error('Something went wrong logging in', err)
                    setIsLoading(false)
                }
            // } else {
            //     setIsLoading(false)
            //     setUserMsg('Something went wrong')
            // }
        } else {
            setIsLoading(false)
            setUserMsg('Enter a valid email address')
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Netfilx Clone Sign In</title>
            </Head>
            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <a className={styles.logoLink} href="/">
                        <div className={styles.logoWrapper}>
                            <Image src={netflixIcon} alt="Netflix Logo" width={148} height={34} />
                        </div>
                    </a>
                </div>
            </header>
            <main className={styles.main}>
                <div className={styles.mainWrapper}>
                    <h1 className={styles.signinHeader}>Sign In</h1>
                    <input type='text' placeholder='Email Address' className={styles.emailInput} onChange={handleOnChangeEmail} />
                    <p className={styles.userMsg}>{userMsg}</p>
                    <button onClick={handleLogInWithEmail} className={styles.loginBtn}>{isLoading ? "Loading..." : "Sign In"}</button>
                </div>
            </main>
        </div>
    )
}

export default Login