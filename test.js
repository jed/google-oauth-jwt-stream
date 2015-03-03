import fs from "fs"
import assert from "assert"

import {Token} from "./google-oauth-jwt-stream"

let email = process.env.GOOGLE_OAUTH_EMAIL
let key = process.env.GOOGLE_OAUTH_KEY

let scopes = ["https://spreadsheets.google.com/feeds"]
let options = {ttl: 10 * 1000, pad: 1000}

let token = new Token(email, key, scopes, options)
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
