import Image from "next/image"
import styles from './card.module.css'
import { useState } from "react"
import { motion } from "framer-motion"
import cls from "classnames"


const Card = (props) => {
    const {imgUrl ='/static/clifford.webp', size = 'medium', id, shouldScale = true } = props

    const [imgSrc, setImgSrc] = useState(imgUrl)

    const classMap = {
        large: styles.lgItem,
        medium: styles.mdItem,
        small: styles.smItem
    }
    const handleOnError = () => {
        console.log('hi error')
        setImgSrc('https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=859&q=80')
    }

    const scale = id === 0 ? {scaleY: 1.1} : {scale: 1.1}

    const shouldHover = shouldScale &&  {
        whileHover: { ...scale}
    }

    return (
        <div className={styles.container} >
            <motion.div className={cls(styles.imgMotionWrapper, classMap[size])} {...shouldHover}>
                <Image src={imgSrc} alt="Sample picture" layout="fill" onError={handleOnError} className={styles.cardImg}/>
            </motion.div>
        </div>
    )
}

export default Card