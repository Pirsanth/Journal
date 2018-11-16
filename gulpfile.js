var gulp = require("gulp");
var bs = require("browser-sync").create();
var nodemon = require("gulp-nodemon");


gulp.task("frontend",["startServer"], function (cb) {
      bs.init({proxy: "http://localhost:8080/user/9-2018.html",
              port: 3000})

      gulp.watch("assets/*", bs.reload);

})

gulp.task("startServer", function () {
  return  nodemon({"ignore": "assets/*"});
})
