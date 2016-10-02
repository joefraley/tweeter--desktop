'use strict'
import FS from 'fs'
import Twitter from 'twit'
import Firebase from 'firebase'
import CONFIG from './config.json'

/* API console: https://apps.twitter.com/app/12881539/show
*/
const twitter = new Twitter(CONFIG.twitter)


/* API console: https://console.firebase.google.com/project/tweeter-80d2b/database/data
*/
const app = Firebase.initializeApp(CONFIG.firebase)


/* @returns Firebase Promise of <Void>
*/
export function storeTweet({tweet, media}) {
  console.log(tweet, media)
  const note = Firebase.database().ref(tweet.id.toString())
  const firebaseNote = note.set(tweet)

  if (media) {
    console.log('uploading picture to storage...')
    const storage = Firebase.storage().ref(tweet.id.toString())
    return storage.put(media)
  }
  else { return firebaseNote }
}


/* @returns <Twit Promise> with result = <Twitter Response Obj>
*/
export function postTweet(status, media_ids) {
  console.log('posting a tweet')
  console.log(status, media_ids)
  return twitter.post('statuses/update', {
    status,
    media_ids,
    trim_user: true
  })
}



export function postPhoto(file_path, status) {
  console.log('posting some media')
  console.log(file_path)
  return new Promise((resolve, reject) => {
    twitter.postMediaChunked({ file_path }, function(error, data, response) {
      if (error) reject(error)
      else resolve(data)
    })
  })
}
