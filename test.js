import fs from "fs"
import assert from "assert"

import {Token} from "./google-oauth-jwt-stream"

let key =
  process.env.GOOGLE_OAUTH_KEY ||
  Buffer(fs.readFileSync("./key.pem.base64", "utf8"), "base64")

let email =
  process.env.GOOGLE_OAUTH_EMAIL ||
  fs.readFileSync("./email.txt", "utf8").trim()

let scopes = ["https://spreadsheets.google.com/feeds"]
let options = {ttl: 10 * 1000, pad: 1000}

let token = new Token(email, key, scopes, options)

let testGet = () => {
  token.get((err, token1) => {
    if (err) throw err

    assert.ok("access_token" in token1)
    assert.ok("token_type" in token1)
    assert.ok("expires_in" in token1)

    token.get((err, token2) => {
      if (err) throw err

      assert.deepEqual(token1, token2)
      testStreams()
    })
  })
}

let testStreams = () => {
  let tokens = []
  let start = Date.now()

  token.createReadStream().on("data", token => {
    assert.ok("access_token" in token)
    assert.ok("token_type" in token)
    assert.ok("expires_in" in token)

    let count = tokens.push(token)
    let seconds = 0 | (Date.now() - start) / 1000

    console.log("token #%s at %ss", count, seconds)
    if (count === 5) process.exit(0)
  })
}

testGet()
