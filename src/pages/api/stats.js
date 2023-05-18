import { findVideoIdByUser, insertStats, updateStats } from "../../../lib/db/hasura"
import { verifyToken } from "../../../lib/utils"


export default async function stats(req, res) {

    try {
        const token = req.cookies.token
            if (!token) {
                res.status(403).send({})
            } else {
                const inputParams = req.method === 'POST' ? req.body : req.query
                const {videoId} = inputParams
            
                if(videoId) {
                    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
                    // const userId = decodedToken.issuer

                    const userId = await verifyToken(token)
    
                    const findVideo = await findVideoIdByUser(userId, videoId, token)
                    
                    const doesStatsExist = findVideo?.length > 0

                    if (req.method === "POST") {
                        const {favourited, watched = true} = req.body
                        if(doesStatsExist) {
                            const response = await updateStats(token, {favourited, watched, userId, videoId})
                            res.send({ data:response })
                        } else {
                            const response = await insertStats(token, {favourited, watched, userId, videoId})
                            res.send({ data:response })
                        }
                    } else {
                        if(doesStatsExist) {
                            res.send({data:findVideo})
                        } else {
                            res.status(404)
                            res.send({ user:null, msg:"video not found" })
                        }
                    }
                } else {
                    res.status(500).send({ msg: "videoId is required" });
                }
            }
    } catch(error) {
        console.error('Error occurred /stats', error)
        res.status(500).send({done : false, error:error?.message})
    }

}

//     if(req.method === 'POST') {
//         console.log({ cookies: req.cookies})

//         try {
//             const token = req.cookies.token
//             if (!token) {
//                 res.status(403).send({})
//             } else {
//                 const {videoId, favourited, watched = true} = req.body
            
//                 if(videoId) {
//                     const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
//                     const userId = decodedToken.issuer
    
//                     const findVideo = await findVideoIdByUser(userId, videoId, token)
                    
//                     const doesStatsExist = findVideo?.length > 0
                   
//                     if(doesStatsExist) {
//                         const response = await updateStats(token, {favourited, watched, userId, videoId})
//                         res.send({ data:response })
//                     } else {
//                         const response = await insertStats(token, {favourited, watched, userId, videoId})
//                         res.send({ data:response })
//                     }
//                 } else {
//                     res.status(500).send({ msg: "videoId is required" });
//                 }
//             }
//         } catch (error) {
//             console.error('Error occurred /stats', error)
//             res.status(500).send({done : false, error:error?.message})
//         }
//     } else {
//         try {
//             const token = req.cookies.token
//             if (!token) {
//                 res.status(403).send({})
//             } else {
//                 // console.log('body data', req.query)
//                 const { videoId } = req.query

//                 if(videoId) {
//                     const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
//                     const userId = decodedToken.issuer
    
//                     const findVideo = await findVideoIdByUser(userId, videoId, token)
//                     console.log(findVideo)
//                     const doesStatsExist = findVideo?.length > 0
//                     if(doesStatsExist) {
//                         res.send({data:findVideo})
//                     } else {
//                         res.status(404)
//                         res.send({ user:null, msg:"video not found" })
//                     }
//                 } else {
//                     res.status(500).send({ msg: "videoId is required" });
//                 }
//             }
//         } catch (error) {
//             console.error('Error occurred /stats', error)
//             res.status(500).send({done : false, error:error?.message})
//         }
//     }
// }



