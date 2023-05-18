import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "../../styles/Video.module.css";
import clsx from "classnames";
import { getYoutubeVideoById } from "../../../lib/videos";
import NavBar from "../../../components/nav/navbar";
import Like from "../../../components/icons/like-icon";
import DisLike from "../../../components/icons/dislike-icon";
import { useState, useEffect } from "react";

Modal.setAppElement("#__next");

export async function getStaticProps(context) {

  console.log({context})

  const videoId = context.params.videoId
  const videoDetails = await getYoutubeVideoById(videoId)
  console.log({videoDetails})

  return {
    props: {
      videoDetails: videoDetails.length > 0 ? videoDetails[0] : {},
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"]

  // Get the paths we want to pre-render based on posts
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: "blocking" };
}

const Video = ({ videoDetails }) => {
  console.log({videoDetails})
  const router = useRouter();
  const videoId = router.query.videoId

  const [toggleLike, setToggleLike] = useState(false)
  const [toggleDislike, setToggleDislike] = useState(false)

  const { 
    title, 
    publishTime, 
    description, 
    channelTitle, 
    statistics: { viewCount } = { viewCount: 0 }, 
  } = videoDetails;

  // useEffect(async () => {
  //   const response = await fetch(`/api/stats?videoId=${videoId}`, {
  //     method: 'GET'
  //   })
  //   const data = await response.json()
  //   console.log({data})
  // }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/stats?videoId=${videoId}`, {
          method: 'GET'
        });
        const data = await response.json();
        console.log(data.data);
        if (data.data.length > 0) {
          const favourited = data.data[0].favourited
          console.log({favourited})
          if (favourited === 1) {
            setToggleLike(true)
          } else if (favourited === 0) {
            setToggleDislike(true)
          }
        } else {
          console.log('not working')
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  
  }, []);
  

  const runRatingService = async(favourited) => {
    return await fetch('/api/stats', {
      method: 'POST',
      body: JSON.stringify({
        videoId, 
        favourited, 
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const handleToggleDislike = async () => {
    console.log('handleToggleDislike')
    const val = !toggleDislike
    setToggleDislike(val)
    setToggleLike(toggleDislike)

    const favourited = val ? 0 : 1
    const response = await runRatingService(favourited)
    console.log('data', await response.json())
  }
  const handleToggleLike = async () => {
    console.log('handleToggleLike')
    const val = !toggleLike
    setToggleLike(val)
    setToggleDislike(toggleLike)

    const favourited = val ? 1 : 0
    const response = await runRatingService(favourited)
    
    console.log('data', await response.json())
  }

  return (
    <div className={styles.cont6ainer}>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div>
          <iframe
            id="ytplayer"
            className={styles.videoPlayer}
            type="text/html"
            width="100%"
            height="360"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=0&rel=0&origin=http://example.com`}
            frameborder="0"
          ></iframe>


          <div className={styles.likeDislikeBtnWrapper}>
            <div className={styles.likeBtnWrapper}>
              <button onClick={handleToggleLike}>
                <div className={styles.btnWrapper}>
                  <Like selected={toggleLike} />
                </div>
              </button>
            </div>
            <button onClick={handleToggleDislike}>
              <div className={styles.btnWrapper}>
                <DisLike selected={toggleDislike}  />
              </div>
            </button>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.modalBodyContent}>
              <div className={styles.col1}>
                <p className={styles.publishTime}>{publishTime}</p>
                <p className={styles.title}>{title}</p>
                <p className={styles.description}>{description}</p>
              </div>
              <div className={styles.col2}>
                <p className={clsx(styles.subText, styles.subTextWrapper)}>
                  <span className={styles.textColor}>Cast: </span>
                  <span className={styles.channelTitle}>{channelTitle}</span>
                </p>
                <p className={clsx(styles.subText, styles.subTextWrapper)}>
                  <span className={styles.textColor}>View Count: </span>
                  <span className={styles.channelTitle}>{viewCount}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
