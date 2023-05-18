import styles from './banner.module.css'
import playIcon from '../../public/static/play_arrow.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'

const Banner = (props) => {

    const {title, subTitle, imgUrl, videoId } = props
    const router = useRouter()

    const handleOnPlay = () => {
        console.log('Handle on play')
        router.push(`/video/${videoId}`)
    }
    return(
        <div className={styles.container}>
            <div className={styles.leftWrapper}>
                <div className={styles.left}>
                    <div className={styles.nseriesWrapper}>
                        <p className={styles.firstLetter}>N</p>
                        <p className={styles.series}>S E R I E S</p>
                    </div>
                    <h2 className={styles.title}>{title}</h2>
                    <h4 className={styles.subTitle}>{subTitle}</h4>
                    <div className={styles.playBtnWrapper}>
                        <button className={styles.btnWithIcon} onClick={handleOnPlay}>
                            <Image src={playIcon} alt='playIcon' width={32} height={32}/>
                            <span className={styles.playText}>Play</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.bannerImg} style={{ 
                backgroundImage: `url(${imgUrl})`, 
                }}
            ></div>
        </div>
    )
}

export default Banner