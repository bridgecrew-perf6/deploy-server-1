const serverConfig = require("./config.json");
const path = require("path");
const ProgressBar = require('progress');
const exec = require('child_process').exec;

// {
//     "name": "private-home",
//     "command": "npm run build",
//     "dest": "./dist",
//     "port": 10000
// }

// module.exports = {
//     apps: [
//         {
//             name: "private-blog",
//             script: 'server.js',
//             out_file: './logs/app-out.log',
//             error_file: './logs/app-err.log',
//             merge_logs: false,
//             log_date_format: 'YYYY-MM-DD HH:mm:ss',
//             env: {
//                 NODE_ENV: 'production',
//                 BUILD_COMMAND: "npm run build",
//                 SERVER_PORT: 1234,
//                 PRODUCT_DEST: "./dist"
//             },
//         }
//     ],
// };


const apps = serverConfig.apps;
const bar = new ProgressBar('Building [:bar] :percent', { total: apps.length, width: 20 });

let currentAppIndex = 0;
const pm2Config = apps.map(name => {
    const appBasePath = path.resolve("..", name);
    const appConfigPath = path.resolve(appBasePath, "server.json");
    const logBasePath = path.resolve(appBasePath, "logs");
    const appConfig = require(appConfigPath);
    const cmd = `cd ${appBasePath} &&` + appConfig.command;
    exec(cmd, function(error, stdout, stderr) {
        if (!error) {
            bar.tick();
            // console.log(`Build ${name} successfully! Process: [${currentAppIndex + 1}/${apps.length}].`);
            currentAppIndex++;
            if (currentAppIndex === apps.length) {
                // console.log(pm2Config);
            }
        } else {
            console.log(error);
        }
    });
    return {
        name: appConfig.name,
        script: 'server.js',
        out_file: path.resolve(logBasePath, "app-out.log"),
        error_file: path.resolve(logBasePath, "app-err.log"),
        merge_logs: false,
        log_date_format: 'YYYY-MM-DD HH:mm:ss',
        env: {
            NODE_ENV: 'production',
            SERVER_PORT: appConfig.port,
            PRODUCT_DEST: appConfig.dest
        },
    }
});

var timer = setInterval(function () {
  if (bar.complete) {
    console.log('\nAll apps are build completely.\n');
    clearInterval(timer);
  }
}, 100);