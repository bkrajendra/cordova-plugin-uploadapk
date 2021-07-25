const fs = require('fs');
const util = require('util');
const stat = util.promisify(fs.stat);
const request = require('request');
const path = require('path');

module.exports = function (ctx) {
  console.log(ctx);

  if (!ctx.opts.platforms.includes('android')) return;

  const platformRoot = path.join(ctx.opts.projectRoot, 'platforms/android');
  const apkFileLocation = path.join(platformRoot, 'app/build/outputs/apk/debug/app-debug.apk');

  const formData = {
    apk: fs.createReadStream(apkFileLocation),
    key: 'YOUR_PASSWORD'
  };
  request.post({ url: 'YOUR_SERVER_URL', formData: formData }, function optionalCallback(err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log(body);
  });

  return stat(apkFileLocation).then(stats => {
    console.log(`Size of ${apkFileLocation} is ${stats.size} bytes`);
  });
};