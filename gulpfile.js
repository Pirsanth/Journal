const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const concat = require("gulp-concat");
const browserify = require("browserify");
const stream = require('gulp-streamify');
const uglify = require('gulp-uglify');
const del = require('del');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const source = require('vinyl-source-stream');
const exorcist = require('exorcist');
const fs = require('fs');
var bs = require("browser-sync").create();
var nodemon = require("gulp-nodemon");

const homePageJsSrcGlob = ["./src/homePage/js/polyfill-import.js", "./src/homePage/js/*.js", "!./src/homePage/js/main.js", "./src/homePage/js/main.js"];
const loginPageJsSrcGlob = ["./src/loginPage/js/polyfill-import.js", "./src/loginPage/js/*.js", "!./src/loginPage/js/main.js", "./src/loginPage/js/main.js"];
const tempDir = "./temp";
const homePageCssSrcGlob = ["./src/homePage/css/normalize.css", "./src/homePage/css/styles.css", "./src/homePage/css/task-form.css"];
const loginPageCssSrcGlob = "./src/loginPage/css/login.css";
//the dir for the build files have been hardcoded to dist below

//factory function so the logic handling the login and home page's js and css is only written once
//named the functions inside as well so they would show up on the command line


function concatAndTranspile (srcGlob, pageName) {
  return function concatAndTranspile () {
          return  gulp.src(srcGlob)
                  .pipe(sourcemaps.init())
                  .pipe(concat("temp.js"))
                  .pipe(babel({"presets": [
                    ["@babel/preset-env",{"useBuiltIns": "entry"}]
                  ]
                }))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(`${tempDir}/${pageName}`))
        }
}

function bundleAndMinifyJS (pageName) {
    return  function bundleAndMinifyJS () {
              return browserify(`${tempDir}/${pageName}/temp.js`, {debug: true}).bundle()
                    .pipe(source(`temp.min.js`))
                    .pipe(stream(sourcemaps.init({loadMaps: true})))
                    .pipe(stream(uglify()))
                    .pipe(stream(sourcemaps.write()))
                    .pipe(gulp.dest(`${tempDir}/${pageName}`))
            }
}

function extractSourceMapAndMoveToDist(pageName) {
  return function extractSourceMapAndMoveToDist () {
          return  fs.createReadStream(`${tempDir}/${pageName}/temp.min.js`)
                  .pipe(exorcist(`./dist/${pageName}.min.js.map`))
                  .pipe(fs.createWriteStream(`./dist/${pageName}.min.js`));
        }
}
function minifyAndPrefixCSS (srcGlob, pageName) {
  var plugins = [autoprefixer(), cssnano()];

  return function minifyAndPrefixCSS() {
    return gulp.src(srcGlob)
          .pipe(sourcemaps.init())
          .pipe(concat(`${pageName}.min.css`))
          .pipe(postcss(plugins))
          .pipe(sourcemaps.write("./"))
          .pipe(gulp.dest("./dist/"))
  }
}



function deleteTempFiles() {
return del([`${tempDir}/**/*.js`]).then(paths => {
    console.log("All the JS files in the temp directory have been deleted");
});
}
//do not pass task name strings to series
gulp.task("build:homePageJS", gulp.series(concatAndTranspile(homePageJsSrcGlob, "homePage"), bundleAndMinifyJS("homePage"), extractSourceMapAndMoveToDist("homePage")))
gulp.task("build:loginPageJS", gulp.series(concatAndTranspile(loginPageJsSrcGlob, "loginPage"), bundleAndMinifyJS("loginPage"), extractSourceMapAndMoveToDist("loginPage")))
gulp.task("build:homePageCSS", minifyAndPrefixCSS(homePageCssSrcGlob, "homePage"));
gulp.task("build:loginPageCSS", minifyAndPrefixCSS(loginPageCssSrcGlob, "loginPage"));

gulp.task("build", gulp.series(gulp.parallel("build:homePageJS", "build:homePageCSS", "build:loginPageJS", "build:loginPageCSS"),
                               deleteTempFiles)
          );

gulp.task("serve", function (cb) {
  nodemon({"ignore": "./*", nodeArgs: ["--inspect"], stdout: false }).on("stdout", function (childBuffer) {
      const childLog = childBuffer.toString();

      console.log(childLog);

      if(childLog.includes("Connection to mongodb established and the http server has been started on port 8080")){
        bs.init({proxy: "http://localhost:8080/login.html",
                port: 3000});
        cb();
      }

  })
});

gulp.task("default", gulp.series("build", "serve"));
