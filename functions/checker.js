const chromium = require('chrome-aws-lambda');
// const puppeteer = require('puppeteer-extra');
const puppeteer = require('puppeteer-core')
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// chromium.puppeteer.use(StealthPlugin())
// puppeteer.use(StealthPlugin());

exports.handler = async function(event, context) {
  const data   = JSON.parse(event.body);
  const username = data.username;

  if(!username) {
    return {
      statusCode: 200,
      
      body: JSON.stringify({
        data:null,
        error: {
          reason: 'username must be a string'
        }
      })
    }
  }
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
    headless: true,
  });


  const page = await browser.newPage();

  await page.goto(`https://www.instagram.com/${username}/`);

  const content = await page.content();

  const count = (content.match(new RegExp(`${username}`, 'gi')) || []).length;

  console.log(count);



//   console.log('user not logged in')
//   // User is not logged in, so log in
//   await page.waitForSelector('input[name="username"]');
// //   await page.waitForTimeout(1400);
//   await page.type('input[name="username"]', "test_insta222214");
// //   await page.waitForTimeout(1040);
//   await page.type('input[name="password"]', "Password123!");
// //   await page.waitForTimeout(1912);
//   console.log('Logging in ...')
//   await page.waitForSelector('button[type="submit"]');
//   await page.click('button[type="submit"]');
//   // Configure the navigation timeout
//   await page.setDefaultNavigationTimeout(0);
//   await page.waitForNavigation({waitUntil: 'networkidle2'});
//   console.log('Logged in successfully!');
//   console.log('User logged in');
// //   await page.waitForTimeout(1912);
//   console.log('Running tests..')
//   const response = await page.goto(`https://www.instagram.com/${username}/?__a=1&__d=dis`);
//   console.log(`Visiting https://www.instagram.com/${username}/?__a=1&__d=dis`)
//   console.log({status: response.status()})
//   console.log({status: await response.status()})





  await browser.close();


  // if (response.status() === 200) {
  //   console.log(`All done, check the screenshot. ✨`)
   
    return {
      statusCode: 200,
      
      body: JSON.stringify({
        data: {
          result: count
        },
        error: null
      })
    }
  // } 
  
  // if (response.status() !== 200){
  //   console.log(`All done, check the screenshot. ✨`)
  //   return {
  //   statusCode: 200,
  //     data: {
  //       result: count
  //     },
  //     error: null
  //   }
  // }
}