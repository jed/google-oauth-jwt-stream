import {stringify} from "querystring"
import {createSign} from "crypto"
import {Readable} from "stream"
import {request} from "https"
import {parse} from "url"

const OAUTH2_URL = "https://accounts.google.com/o/oauth2/token"
const GRANT_TYPE = "urn:ietf:params:oauth:grant-type:jwt-bearer"
const JWT_HEADER = {alg: "RS256", typ: "JWT"}

export class Token {
  constructor(email, key, scopes, options = {}) {
    this.email = email
    this.key = key
    this.scopes = scopes

    this.ttl = options.ttl || 3600000 // 1 hour
    this.pad = options.pad || 60000 // refresh 1m before expiration
  }

  get(cb) {
    let now = Date.now()

    if (this.cached && now < this.cached.expiresAt) {
      return setImmediate(cb, null, this.cached.value)
    }

    this.fetch((err, token) => {
      if (err) return cb(err)

      this.cached = {
        value: token,
        expiresAt: now + (token.expires_in * 1000) - this.pad
      }

      cb(null, token)
    })
  }

  fetch(cb) {
    if (typeof this.key._read == "function") {
      let key = ""

      this.key.on("data", data => key += data)
      this.key.on("error", cb)
      this.key.on("end", () => {
        this.key = key
        this.fetch(cb)
      })

      return
    }

    let now = Date.now()

    let claims = {
      iss: this.email,
      scope: this.scopes.join(" "),
      aud: OAUTH2_URL,
      iat: Math.floor((now           ) / 1000),
      exp: Math.floor((now + this.ttl) / 1000)
    }

    let data = [JWT_HEADER, claims]
      .map(JSON.stringify)
      .map(Buffer)
      .map(x => x.toString("base64"))
      .join(".")

    let sig = createSign("RSA-SHA256")
      .update(data)
      .sign(this.key, "base64")

    let body = stringify({
      grant_type: GRANT_TYPE,
      assertion: [data, sig].join(".")
    })

    let options = parse(OAUTH2_URL)
    options.method = "POST"
    options.headers = {"Content-Type": "application/x-www-form-urlencoded"}

    let req = request(options, res => {
      let json = ""
      res.on("data", data => json += data)
      res.on("end", () => {
        try {
          let token = JSON.parse(json)

          "error" in token
            ? cb(new Error(`Token error: ${token.error}`))
            : cb(null, token)
        }

        catch (err) { cb(err) }
      })
    })

    req.on("error", cb)
    req.end(body)
  }

  createReadStream() {
    let rs = new Readable({objectMode: true})

    rs._read = () => {
      rs._read = wait
      fetch()
    }

    let wait = () => {
      setTimeout(fetch, this.ttl - this.pad)
    }

    let fetch = () => {
      this.fetch((err, token) => {
        err ? rs.emit("error", err) : rs.push(token)
      })
    }

    return rs
  }
}
