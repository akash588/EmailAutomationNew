const puppeteer = require("puppeteer-extra");
const EventEmitter = require("events");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const utils = require("./utils.js");
var fs = require("fs");
const Xvfb = require('xvfb');
const path = require('path')
var nodemailer = require('nodemailer');

var logger = require("tracer").console({
  transport: function (data) {
    console.log(data.output);
    fs.appendFile("./file.log", data.rawoutput + "\n", (err) => {
      if (err) throw err;
    });
  },
});
// const proxy_check = require('proxy-check');

require("puppeteer-extra-plugin-stealth/evasions/defaultArgs");
require("puppeteer-extra-plugin-stealth/evasions/chrome.app");
require("puppeteer-extra-plugin-stealth/evasions/chrome.csi");
require("puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes");
require("puppeteer-extra-plugin-stealth/evasions/chrome.runtime");
require("puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow");
require("puppeteer-extra-plugin-stealth/evasions/media.codecs");
require("puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency");
require("puppeteer-extra-plugin-stealth/evasions/navigator.languages");
require("puppeteer-extra-plugin-stealth/evasions/navigator.permissions");
require("puppeteer-extra-plugin-stealth/evasions/navigator.plugins");
require("puppeteer-extra-plugin-stealth/evasions/navigator.vendor");
require("puppeteer-extra-plugin-stealth/evasions/navigator.webdriver");
require("puppeteer-extra-plugin-stealth/evasions/sourceurl");
require("puppeteer-extra-plugin-stealth/evasions/user-agent-override");
require("puppeteer-extra-plugin-stealth/evasions/webgl.vendor");
require("puppeteer-extra-plugin-stealth/evasions/window.outerdimensions");
require("dotenv").config();
puppeteer.use(StealthPlugin());
const emitter = new EventEmitter();

emitter.setMaxListeners(1000);

var categorizeSeed = {};
const gmailProcess = async () => {

  try {
    var xvfb = new Xvfb({
      silent: true,
      xvfb_args: ["-screen", "0", '1280x720x24', "-ac"],
  });
  xvfb.start((err)=>{if (err) console.error(err)})
    const sessionData = `1`;

    const args = [
      // `--proxy-server=http://${item.proxyIP.trim()}:${item.proxyPort.trim()}`,
      // "--no-sandbox",
      // "--disable-setuid-sandbox",
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
      "--disable-gpu",
     "--disable-dev-shm-usage",
      "--use-gl=egl",
      "--disable-background-timer-throttling",
      "--enable-automation",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
     "--use-gl=swiftshader",
      "--disable-ipc-flooding-protection",
        'disable-extensions',
    ];

    const lauchoptions = {
      // executablePath:
      //   "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      // executablePath: '/usr/bin/chromium-browser',
      args,
      userDataDir: sessionData,
      headless: false,
      devtools: false,
      ignoreHTTPSErrors: true,
      // slowMo: 100
    };

    const width = 1024;
    const height = 1600;

    const browser = await puppeteer.launch(lauchoptions, {
      defaultViewport: { width: width, height: height },
    });
    //  const page = await browser.newPage();
    const page = (await browser.pages())[0];
    page.setDefaultNavigationTimeout(90000);
    // await utils.checkCpuAndDelay(params);

    // try {
    //   await page.setDefaultNavigationTimeout(1000 * 60 * 3);
    // } catch (ex) {
    //   console.error(ex);
    //   //    await browser.close()
    // }
    await page.bringToFront();

    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://www.walmart.com/ip/Super-Mario-Odyssey-Nintendo-Switch/56011600', { waitUntil: 'networkidle2' })
   const  screenshot = await page.screenshot({path: 'test.png', fullPage: true});
    // await page.screenshot({ path: screenshot })
  
 
    

var imageAsBase64 = fs.readFileSync('test.png', 'base64');
//         // console.log('See screen shot: ' + imageAsBase64)    

//       const img = fs.writeFile("out.png", imageAsBase64, 'base64', function(err) {
//             console.log(err);
//           });
        //   console.log(screenshot)
const imgstr = 'test.png'

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'dummyE934@gmail.com',
              pass: 'sample@123'
            }
          });
          
          var mailOptions = {
            from: 'dummyE934@gmail.com',
            to: 'shelarakash310@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy in deploy!',
            attachments: [{
                  // encoded string as an attachment
                    filename: 'test.png',
                    path: './test.png',
                  }]
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });



          await browser.close()
      
        // console.log(Buffer.from(imageAsBase64, 'base64').toString('ascii'))

    //   await browser.close();
    // processBrowsers(browser,page)
    return "DONE";
    xvfb.stop();
  } catch (ex) {
    console.log(ex);
  }
};

module.exports = {
  gmailProcess,
};

const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
const pressenter = async (page, i) => {
  if (i == 0) {
    await sleep(1000);
  } else {
    await Promise.all([page.keyboard.press("Enter")]);
    await Promise.all([page.keyboard.press("Enter")]);
  }
};

const eval = async (page, pageFunction, ...args) => {
  var context = await page._frameManager.mainFrame().executionContext(),
    suffix = `//# sourceURL=VM30`;
  var res = await context._client.send("Runtime.callFunctionOn", {
    functionDeclaration: pageFunction.toString() + "\n" + suffix + "\n",
    executionContextId: context._contextId,
    arguments: args.map((arg) => ({ value: arg })),
    returnByValue: true,
    awaitPromise: true,
    userGesture: true,
  });
  if (res.exceptionDetails)
    throw new Error(res.exceptionDetails.exception.description);
  else if (res.result.value) return res.result.value;
};
