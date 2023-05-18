import Head from 'next/head'

import styles from '../styles/Home.module.css'
import Banner from '../../components/banner/banner'
import NavBar from '../../components/nav/navbar'
import SectionCards from '../../components/card/section-cards'
import { getVideos, getWatchItAgainVideos, getPopularVideos } from '../../lib/videos'
import { verifyToken } from '../../lib/utils'
import useRedirectUser from '../../utils/redirectUser'


export async function getServerSideProps(context) {
  const { userId, token } = await useRedirectUser(context)

  // console.log({ token })

  // if(!userId) {
  //   return {
  //     props: {},
  //     redirect: {
  //         destination: '/login',
  //         permanent: false,
  //     }
  //   }
  // }
  
  const disneyVideos = await getVideos('disney trailer')
  const productivityVideos = await getVideos('productivity')
  const comedyVideos = await getVideos('kiekie')
  const travelVideos = await getVideos('travel')
  const popularVideos = await getPopularVideos('productivity')
  const watchItAgainVideos = await getWatchItAgainVideos(userId, token)
  console.log({watchItAgainVideos})
  return { props: { disneyVideos, productivityVideos, travelVideos, comedyVideos, popularVideos, watchItAgainVideos }}
}


export default function Home({ disneyVideos, productivityVideos, travelVideos, comedyVideos, popularVideos, watchItAgainVideos = [] }) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix Clone</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className={styles.main}>
        <NavBar />
        <Banner 
          title='Clifford the red dog' 
          subTitle='A big red dog' 
          imgUrl='/static/clifford.webp' 
          videoId='4zH5iYM4wJo'
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title='Disney' videos={disneyVideos} size='large'/>
          <SectionCards title='Watch It Again' videos={watchItAgainVideos} size='small'/>
          <SectionCards title='Travel' videos={travelVideos} size='small'/>
          <SectionCards title='Nigerian comedy' videos={comedyVideos} size='medium'/>
          <SectionCards title='Productivity' videos={productivityVideos} size='medium'/>
          <SectionCards title='Popular' videos={popularVideos} size='small'/>
        </div>
      </div>

    </div>
  )
}
