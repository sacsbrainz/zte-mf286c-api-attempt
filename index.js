const { default: axios } = require("axios");
const qs = require("qs");
const  {wrapper}   = require("axios-cookiejar-support");
const {CookieJar}  = require("tough-cookie");
const jar = new CookieJar();
const client = wrapper(axios);

globalThis.window={}
const encrypt = async ()=> {
  const JSEncrypt = (await import('jsencrypt')).default
  const jsencrypt = new JSEncrypt()
//   your router password
  const value = "Your_password" 
  jsencrypt.setPublicKey("-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALk84jQ1Uqbwo10Ewm6Kkf7KPlAemzO/\nmE+563HmUk0H6C1ZUb/D4hZq4NNgdFJCpBgZgCIA1v6WsQoJQ6D5VIsCAwEAAQ==\n-----END PUBLIC KEY-----")
  const encrypted = jsencrypt.encrypt(value);
  let val = encrypted
  return encrypted
}
const encrypted = encrypt()

// this handles the user login
const logIn = async () => {
  const newRes = await client({
    method: "POST",
    url: `http://192.168.0.1/action/login`,
    headers: {
      Host: "192.168.0.1",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: "http://192.168.0.1",
      Referer: "http://192.168.0.1/pub/login.html",
      Connection: "keep-alive",
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:104.0) Gecko/20100101 Firefox/104.0",
    },
    data: qs.stringify({password: (await encrypted).toString()}),
    jar: jar,
    withCredentials: true,
  })
    .then((res) => {
      getHomePage()
    })
    .catch((err) => {
      console.error(err);
    });
};

// this gets the homepage and returns it as html
const getHomePage = async () => {
 await client({
  method: "GET",
  url: `http://192.168.0.1/home.html`,
  headers: {
    Accept:
      "text/html,application/json,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    'Content-type': "application/json",
    Origin: "http://192.168.0.1",
    Referer: "http://192.168.0.1/pub/login.html",
    Connection: "keep-alive",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-GB,en",
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
  },
  jar: jar,
  withCredentials: true,
}).then((res) => {
    console.log(res.data);
  });
};

logIn();
