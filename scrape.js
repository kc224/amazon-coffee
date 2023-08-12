//importing packages
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);


const url = 'https://www.amazon.com/Mr-Coffee-Cappuccino-Stainless-Measuring/dp/B08NFMKHSK/ref=sr_1_5?crid=PNR40R8BC4B6&keywords=espresso+machine&qid=1691812254&sprefix=espresso+machine%2Caps%2C100&sr=8-5'


const product = {name: '', price: '', link: ''};

//set interval
const handle = setInterval(scrape, 2000);

async function scrape() {
  //fetch data using axios
  const {data} = await axios.get(url);
  //load up the html
  const $ = cheerio.load(data);
  const item = $('div#dp-container');
  //extract the data we want/need
  product.name = $(item).find('h1 span#productTitle').text();
  product.link = url;
  const price = $(item)
  .find('span .a-price-whole')
  .first()
  .text()
  .replace(/[,.]/g, '');

  const priceInt = parseInt(price);
  product.price = priceInt;
  console.log(product);

  //send an SMS
  if(priceInt < 50) {
    client.messages
    .create({
      body: `The price of ${product.name} went below ${price}. Purchase it at ${product.link}`,
      from: '+18558987809',
      to: '+19494477203'
    })
    .then((message) => {
      console.log(message);
      clearInterval(handle);
    });
  }

  
}

scrape();

