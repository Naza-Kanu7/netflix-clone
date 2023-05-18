import styles from "./navbar.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import expandMoreIcon from '../../public/static/expand_more.svg'
import Image from "next/image";
import netflixIcon from '../../public/static/netflix.svg'
import { magic } from "../../lib/magic-client";

const NavBar = () => {
    const [showDropdown, setShowDropdown] = useState(false)
    const [username, setUsername] = useState('')
    const [didToken, setDidToken] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function getUsername() {
            try {
                const { email, issuer } = await magic.user.getMetadata();
                const didToken = await magic.user.getIdToken()
                console.log({ didToken })
                if(email) {
                    console.log(email)
                    setUsername(email)
                }
            } catch(error) {
                console.error("Error retrieving email:", error);
            }
        }
        getUsername()
    }, [])
    
    


    const handleOnClickHome = (e) => {
        e.preventDefault()
        router.push('/')
    }

    const handleOnClickMyList = (e) => {
        e.preventDefault()
        router.push('/browse/my-list')
    }

    const handleShowDropdown = (e) => {
        e.preventDefault()
        setShowDropdown(!showDropdown)
    }

    const handleSignOut = async (e) => {
        e.preventDefault()
        try {
            // await magic.user.logout();
            // console.log(await magic.user.isLoggedIn()); // => `false`
            // router.push('/login')
            const response = await fetch("/api/logout", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${didToken}`,
                  "Content-Type": "application/json",
                },
            });
        
            const res = await response.json();
        } catch(error) {
            console.error("Error signing you out:", error);
            router.push("/login");
        }
    }


    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <a className={styles.logoLink} href="/">
                    <div className={styles.logoWrapper}>
                        <Image src={netflixIcon} alt="Netflix Logo" width={148} height={34} />
                    </div>
                </a>
                <ul className={styles.navItems}>
                    <li className={styles.navItem} onClick={handleOnClickHome}>
                        Home
                    </li>
                    <li className={styles.navItem2} onClick={handleOnClickMyList}>
                        My List
                    </li>
                </ul>
                <nav className={styles.navContainer}>
                    <div>
                        <button className={styles.usernameBtn} onClick={handleShowDropdown}>
                            <p className={styles.username}>{username}</p>
                            <Image src={expandMoreIcon} alt="expand dropdown" width={24} height={24} />
                        </button>
                        {showDropdown && <div className={styles.navDropdown}>
                            <div>
                                <a href='/login' className={styles.linkName} onClick={handleSignOut}>
                                   Sign Out
                                </a>
                                <div className={styles.lineWrapper}></div>
                            </div>
                        </div>}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default NavBar;
