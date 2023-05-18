import '@/styles/globals.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { magic } from '../../lib/magic-client'
import Loading from '../../components/loading/loading'
// import { Roboto_Slab } from 'next/font/google'



// const RobotoSlab = Roboto_Slab({
//   weight: ['400', '700'],
//   style: ['normal'],
//   subsets: ['latin'],
// })

export default function App({ Component, pageProps }) {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkLoggedIn =  async () => {
      
      const isLoggedIn = await magic.user.isLoggedIn()
      if(isLoggedIn) {
        router.push('/')
      } else {
        router.push('/login')
      }
    }
    checkLoggedIn()
  }, [])

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

  return (
    <main>
      {isLoading ? <Loading /> : <Component {...pageProps} />}
    </main>
  )
}

