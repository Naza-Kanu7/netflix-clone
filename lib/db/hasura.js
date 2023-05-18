export async function insertStats(token, { favourited, userId, watched, videoId }) {
  const operationsDoc = `
  mutation insertStats($favourited:Int!, $userId:String!, $watched: Boolean!, $videoId: String! ) {
    insert_stats_one(object: {
      favourited: $favourited, 
      userId: $userId, 
      videoId: $videoId, 
      watched: $watched
    }) {
        favourited
        userId
        videoId
        watched
    }
  }
`;
  
  // const {issuer, email, publicAddress} = metaData
  return await queryHasuraGQL(
    operationsDoc,
    "insertStats",
    {
      favourited, 
      userId, 
      watched, 
      videoId
    }, 
    token,
  )
}



export async function updateStats(token, { favourited, userId, watched, videoId }) {
  const operationsDoc = `
  mutation updateStats($favourited:Int!, $userId:String!, $watched: Boolean!, $videoId: String! ) {
    update_stats(
      where: {
        userId: {_eq: $userId}, 
        videoId: {_eq: $videoId}}, 
      _set: {favourited: $favourited, watched: $watched}) {
      returning {
        favourited
        watched
        id
        userId
        videoId
      }
    }
  }
`;
  
  // const {issuer, email, publicAddress} = metaData
  return await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    {
      favourited, 
      userId, 
      watched, 
      videoId
    }, 
    token,
  )
}





export async function findVideoIdByUser(userId, videoId, token) {
  const operationsDoc = `
    query findVideoIdByUserId ($userId: String!, $videoId: String!) {
      stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
        id
        userId
        videoId
        watched
        favourited
      }
    }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "findVideoIdByUserId",
    {
      userId,
      videoId,
    }, 
    token,
  )
  console.log({ response })
  return response?.data?.stats;
}




export async function createNewUser(token, metaData) {
  const operationsDoc = `
    mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
      insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
        returning {
          email
          issuer
          publicAddress
        }
      }
    }
  `;
  
  const {issuer, email, publicAddress} = metaData
  const response = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    {
      issuer,
      email,
      publicAddress
    }, 
    token,
  )
  console.log({ response, issuer })
  return response
}


export async function isNewUser(token, issuer) {
  const operationsDoc = `
    query isNewUser($issuer: String!) {
      users(where: {issuer: {_eq: $issuer}}) {
        email
        issuer
      }
    }
  `;

  const response = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    {
      issuer,
    }, 
    token,
  )
  console.log({ response, issuer })
  return response?.data?.users?.length === 0;
}

export async function getWatchedVideos(userId, token) {
  const operationsDoc = `
  query watchedVideos( $userId: String!) {
    stats(where: {watched: {_eq: true}, userId: {_eq: $userId}}) {
      videoId
    }
  }
`;
  const response = await queryHasuraGQL(
    operationsDoc,
    "watchedVideos",
    {
      userId,
    }, 
    token,
  )
  // console.log({ response, issuer })
  return response?.data?.stats;
}



export async function getMyListVideos(userId, token) {
  const operationsDoc = `
  query favouritedVideos( $userId: String! ) {
    stats(where: {userId: {_eq: $userId}, favourited: {_eq: 1}}) {
      videoId
    }
  }
  `;
  const response = await queryHasuraGQL(
    operationsDoc,
    "favouritedVideos",
    {
      userId,
    }, 
    token,
  )
  // console.log({ response, issuer })
  return response?.data?.stats;
}

async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(
    process.env.NEXT_PUBLIC_HASURA_ADMIN_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": 'application/json'
        // 'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await result.json();
}


  
// const operationsDoc = `
//   query MyQuery {
//     users(where: {issuer: {_eq: "did:ethr:0x3E4f2Ce212e2E472343A6bebf275F0bFd7EF79C5"}}) {
//       email
//       issuer
//     }
//   }
// `;

// function fetchMyQuery() {
//     return queryHasuraGQL(
//         operationsDoc,
//         "MyQuery",
//         {}, 
//         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJkaWQ6ZXRocjoweDNFNGYyQ2UyMTJlMkU0NzIzNDNBNmJlYmYyNzVGMGJGZDdFRjc5QzUiLCJwdWJsaWNBZGRyZXNzIjoiMHgzRTRmMkNlMjEyZTJFNDcyMzQzQTZiZWJmMjc1RjBiRmQ3RUY3OUM1IiwiZW1haWwiOiJrYW51Y2hpbmF6YTcwQGdtYWlsLmNvbSIsIm9hdXRoUHJvdmlkZXIiOm51bGwsInBob25lTnVtYmVyIjpudWxsLCJ3YWxsZXRzIjpbXSwiaWF0IjoxNjgzNzkxODY4LCJleHAiOjE2ODQzOTY2NjgsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciIsImFkbWluIl0sIngtaGFzdXJhLXVzZXItaWQiOiJkaWQ6ZXRocjoweDNFNGYyQ2UyMTJlMkU0NzIzNDNBNmJlYmYyNzVGMGJGZDdFRjc5QzUifX0.JhQjY6p-IGBmk6qls80cuo4ELPlRrYEpMcKMCSTSTaE'
//     );
// }

// export async function startFetchMyQuery() {
//     const { errors, data } = await fetchMyQuery();

//     if (errors) {
//         // handle those errors like a pro
//         console.error(errors);
//     }

//     // do something great with this precious data
//     console.log(data);
// }

// startFetchMyQuery();