import { magicAdmin } from "../../../lib/magic"
import jwt from 'jsonwebtoken'
import { isNewUser, createNewUser } from "../../../lib/db/hasura"
import { setTokenCookie } from "../../../lib/cookies"


export default async function Login(req, res) {
    if(req.method === "POST") {
        try{
            const auth = req.headers.authorization
            const didToken = auth ? auth.substr(7) : ''
            // console.log({ didToken })
            
            const metaData = await magicAdmin.users.getMetadataByToken(didToken)
            // console.log({ metaData })
            
            // create jwt
            const token = jwt.sign(
                {
                    ...metaData,
                    "iat": Math.floor(Date.now() / 1000),
                    "exp": Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
                    "https://hasura.io/jwt/claims": {
                      "x-hasura-default-role": "user",
                      "x-hasura-allowed-roles": ["user", "admin"],
                      "x-hasura-user-id": `${metaData.issuer}`,
                    }
                },
                process.env.JWT_SECRET
            )
            // console.log({ token })

            // CHECK IF USER EXISTS
            const isNewUserQuery = await isNewUser(token, metaData.issuer)
            isNewUserQuery && await createNewUser(token, metaData)
            setTokenCookie(token, res)
            res.send({ done: true }) 
        
            // res.send({ done: true, isNewUserQuery }) 
        } catch(error) {
            console.error('Something went wrong logging in', error)
            res.status(500).send({ done: false})
        }
    } else {
        res.send({ done: false }) 
    }
}

// if (isNewUserQuery) {
            //     // create a  new user
            //     const createNewUserMutation = await createNewUser(token, metaData)
            //     // console.log({ createNewUserMutation })
            //     // set the cookie
            //     const cookie = setTokenCookie(token, res)
            //     console.log({cookie})
            //     res.send({ done: true, msg: 'is a new user' }) 
            // } else {
            //     // set the cookie
            //     const cookie = setTokenCookie(token, res)
            //     console.log({cookie})
            //     res.send({ done: true, msg: 'not a new user' }) 
            // }