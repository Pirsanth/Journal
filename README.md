# Journal
My first fullstack project made with vanilla Node.js and no frontend frameworks. It is an online web application that uses MongoDB for the database and implements session based authentication. Throughout the application, I have limited the amount of imported code (libraries to deal with sessions or hashing passwords for example) to a minimum to improve my understanding of web development. Indeed all of the dependencies (see package.json) except handlebars and mongodb are used in the build process by gulp.

A bullet point summary of the project:

* Used **git** as a VCS since the inception of the project with nearly 100 commits so far.

* Used plenty of **regular expressions** throughout for string matching.

* Modules used: **Node-flavoured Common JS** for the backend and **IIFEs** for the frontend.

* I have chosen to not use promises as I wanted to practice using the **error first, return early** convention that is prevalent in the Node.js ecosystem.

* I used the **MVC programming paradigm** for this application. I named the controllers to include the HTTP method it serves. Eg. `controller/postProcessRegistration.js` would be for POST requests. `router.js` is responsible for sending the incoming requests to the proper controllers.

* Implemented **sessions based authentication** with the sessions stored in the MongoDB database and a cookie with the sessionId sent to the client. A TTL collection to ensure that a user's session only lasts 3 hours long. Allows the user to log into multiple devices at the same time.

* Implemented **form validation** on the frontend. Used the constraint validation API as the basis to check for input validity but decided to build my own validation messages as the native validation messages are ugly. Special thanks to Peter-Paul Koch [1] for his research into browser support for the constraint validation API.

* **Hashed and salted the user passwords** and implemented **message authentication** to protect the cookies. Used node's built in crypto module to achieve both goals.

* Used **gulp** to automate a build process that includes **transpiling (babel), bundling (browserify) and minifying**. Made gulp serve the files by running **browserSync** after the server is ready.

* The **source maps** for for the css and js files are available client side and will be sent when requested by opening Dev Tools.

* Included **references** to thank those who have helped me come so far.

___
## Quick start
>Use **`set MONGODB_CONNECTION_STRING`** (on windows) to pass the mongodb connection string to the Node server. (beware of spaces around the =). Default: "mongodb://localhost/journal"

>Similar to the above use **`set NODE_SERVER_PORT_NUMBER`** on a windows machine to change the port the Node server will listen on. Default: 8080. Note: this should be a number.

> Run **`gulp serve`** to start the server. After the server has connected to the database, a browser window or tab  will be opened pointing to the login page.

>Run **`gulp build`** to build the minified and bundled JS and CSS files in dist

>Run **`gulp`** to first build the minified and bundled JS and CSS files then start the server and finally open the browser to the login page.

___
## Checklist
- [x] Change code to work with new MongoDB data model then add git tags for the older model, delete oldModel branch (use tag to remember instead) and fast-forward merge master to new model branch
- [x] Finish DELETE and PUT requests to complete REST API
- [x] Add authentication with either cookies of JSON web token and make a login page (choose to go with sessions'based authentication)
- [x] Add form validation for the frontend
- [x] Hash passwords && protect from regexDOS (dealing with regexDOS is postponed until a build process is established)
- [x] Jazz up frontend
- [x] Make a build process to minify, bundle and transpile JS
- [x] Reflect on the project and update readme.md with a debreif

Note: I am afraid I do not know enough about regexDOS or the underlying regex engine used by Node (DFA or NFA?) at this moment to comment on how secure my code is against regex DOS attacks. I simply refuse to serve a client if the URI is too long. I hope that it will reduce the amount backtracking that occurs.
___
## Implementation Notes

### Justifying the choice of the compound index on the taskObjects collection
Describing the index on taskObjects:
`tasksObjectCollection.createIndex({username: 1, startUTCDate: 1, endUTCDate: 1, taskName: 1}, function (err, result) {}`

* I put the fields for time before the fields for taskName because I thought
  time would be more selective than taskName.

In model/streamTaskObjects.js we have:
 `collection.find({username, startUTCDate: {$gte: startBound, $lte: endBound}}, {projection:{"_id": 0, "startUTCDate": 1, "endUTCDate": 1, "taskName": 1}, sort:[["startUTCDate", 1]]});`

* I placed startUTCDate in the second place of the index on the taskObjects collection because in
model/streamTaskObjects.js the query uses username with the equality operator
then startUTCDate with a range. Hence, by placing startUTCDate in the second place the compound
index can be used for the sort in model/streamTaskObjects.js as well [2].

* At the same time I use a covered query [3] in model/streamTaskObjects.js by excluding _id in the projection since model/streamTaskObjects.js only deals with retrival and all that can be accomplished in the index (on a side note: the code to check the database for whether a user exists also uses a covered query for extra efficiency).


### Handling dates and timezones
In a webapp the timezone of the client and the server may differ. When saving a task, I chose to address this by always receiving the offset of the client with every task added and saving the task in UTC using the given offset.

For example, in controller/postAddTask.js we have:

 `let startUTCDate = new Date(Date.UTC(year, month, startDate, startTimeHours, startMinutesAfterOffset));`

StartMinutesAfterOffset is just the minutes of the given time for the task with the offset accounted for. Even if we pass a value of greater than 60 in the minutes field for the Date constructor, it just wraps around like in modular arithmetic. If we set a breakpoint in Chrome Dev Tools at this point we see that the Date object produced has the timezone of the machine (it would give the date and time in the timezone of the machine). That is fine and is true of date objects in general. What is important is that it represents the same point in time the task would have occured in UTC.

In controller/getTasksInMonth.js we have:

`let startBound = new Date(Date.UTC(year, month, 1, 0, offset));`

This uses the same principle as above and is there to insure that rather than give the tasks that correspond to the UTC start of the monthe, we serve the tasks that correspond to the start of the month for the timezone of the user.

In helper.js there is:

```javascript
function getHomePageURI (username, offset) {
  let clientTimestamp = (Date.now() - (parseInt(offset)*60*1000));
  let clientDate = new Date(clientTimestamp);
  return `${username}/${clientDate.getUTCMonth()}-${clientDate.getUTCFullYear()}.html`;
}
```
The above is for the fringe cases where we are at the starting date or end date of the month. For example, at UTC is might be the 31st of January but for the client it might be the 1st of February. In it I am speeding up the time at Greenwich to match the time at the client, given the timezone offset of the client in minutes. Hence, I use the getUTC methods to aquire the client's month and year.This ensures I serve up the correct month and year for the home page with respect to the client.

Now considering the frontend, for the home page of the app I wanted to use URL encoded strings for my POST requests and simply use JSON for the DELETE and PUT methods for added experience. I added the timezone offset to the query string in a rather contrived way using addTimezonOffsetToQueryString in ajaxCommunication.js. After hammering out the code for the home page I realised that I could've just placed the offset as a hidden element in the form, populated it at startup with JS and treated it like any of the other form fields. Having learnt this, I used this approach for the login page.

Still on the homepage, when I send the DELETE and PUT requests I am sending JSON with the date objects in it. When using JSON.stringify (to send it over the wire) on a Date object, the Date's .toJSON method is called (its true for other objects as well). Under the hood this just uses the Date's toUTCString method. We thus have a standardized way to stringify it. The problem occurs when we try to convert it back to a Date object on the other end. JSON.parse does not work to revert it and MDN strongly discourages relying on the date constructor or Date.parse() mainly due to preES5 implementation specific differences [4]. Although the browsers I choose to support are ES5 and above I decided to manually parse the date strings just to play it safe. I wrote the parseISOStringToDate function that uses regex for this purpose. One of the benefits to node is that we can use the same code client-side and server-side as I have done with this function here.

### CSS Optimizations and UX considerations
* I used transform instead of display: none to display: block for the transitons of both the menu container and taskform in the home page of the app. I did this so as to use the GPU and prevent a  costly reflow and repaint.
* In a similar vein all of the validation messages appear with opacity:1 instead of depending on the display property.
* I decided against using the input type of date due to poor browser support and me wanting to create a consistent UX experience.
* Nearing the end of development I realise that there is a problem with how I chose to implement the date picker in the frontend. In particular, a user cannot select an end date on a month in the future. Originally I designed it with just the start date in mind, starting on a date other than the current month was not needed. But I had not considered the problem mentioned above with regards to the end date.
* I was deciding between implementing an input type of text with a regex pattern attribute so as to disallow exponential notation and only allow integers or an input type number and enforcing a step of 1. In the end I went with the input type of number and allowed exponential notation because I thought the added ability of mobile browsers to supply a number-centric keyboard was better for UI. To accomodate, I added checks in the backend for integer values only irrespective, of whether it is of exponent form.

### On the build process implemented
When I first started making this project, I only knew about transpilers. Having no knowledge bundlers, I used IIFEs in my frontend code. The problem with IIFEs is that they have to be loaded in the correct order. In my project, main.js had to be loaded last for both the home page and the login page. I did not want to change the frontend code to use another kind of module so the most natural way for me to translate the code into an entry file for Browserify was to concatinate the IIFEs in the correct order. Thus, in gulpfile.js I have `homePageJsSrcGlob` and `loginPageJsSrcGlob` which serve to ensure that the `import "@babel/polyfill"` statement comes first and  main.js comes last in the concatinated file. I would have prefered to go with babel's `useBuiltIns: "usage"` option for smaller file bundle sizes but saw that it was still experimental hence I opted to go the safer route with `useBuiltIns: "entry"`. Before adding a build process, I used a specific version of handlebars downloaded from a CDN using a script tag. In the final version I simply required hanlebars it in the IIFE for homePage's viewAndModel.js.

Note: Shoutout to [5] for helping me make sense of Browserify's output.
### Security
#### 1) Message Authentication for sessionId
Here we are verifying the integrity of the sessionId sent out by the server. If the user has modified the sessionId (perhaps maliciously to guess another logged in user's session id) we would like to deny access. An simple hash of the sessionId would not work for verifying integrity because what would stop the user from changing the sessionId and rehashing it? We thus need to add a secret key that is only available to the server.

Now I will discuss why using a normal hash function with the key appended to the message would be less that ideal for my current use case. Lets say we have a hash function H, a message m and a key k. If we choose to prefix the key in the hash function so that it takes the form of H(k||m), since the hash function I use is SHA-256 which is based off a 	Merkle–Damgård construction, it would be prone to length extension attacks. To explain this attack simply, imagine that every input into a Merkle–Damgård construction hash moves the internal state to a new one, based on the input. An attacker could append his own data by first moving to the internal state that which corresponds to H(k||m) then adding onto m and computing the hash. This would correspond to H(k||m + x) where x is the data appended by the attacker. Appending the key such that the hash takes the form of H(m||k) is insufficient as well since the internal state moves based upon the input received, the attacker would simply need to find a collision for m (which he has in plaintext and can compute a hash for) and he does not even have to bother with the digest or figuring out what the secret key is as the hash would be correct anyways [6]. These problems are addressed by using a HMAC like I did in this project because the internal state of the hash would be obfusticated, making it resilient to length extension attacks.

##### On the creation of the HMAC key
Node will create a HMAC key on start if a valid one does not exist in the cwd or it will lodad one from the cwd if otherwise. The sessions are to be valid for 3 hours, after which the user must login again. If a new HMAC key needs to be created however, the sessions will be deleted as there would be no way to verify the integrity of the sessionId's received.

##### On the arguments chosen for the HMAC
In model/manageHMACSecretKey.js, this is the code that checks if the HMACsecretKey.txt exists and validates the key if found or creates a new HMAC secret key.

```javascript
if((err && err.code === "ENOENT") || keyString.length !== 64){
  crypto.randomBytes(32, function (err, buff) {
    if(err){
      fn(err);
      return;
    }
      const keyString = buff.toString("hex");
      module.exports.secretKey = keyString;
      fs.writeFile("./HMACsecretKey.txt", keyString, "utf-8", function (err) {
        if(err){
          fn(err);
          return;
        }
        deleteAllSessions(function (err) {
          if(err){
            fn(err);
            return;
          }
          console.log("Could not find HMAC key or key was invalid. New key saved to file system and previous sessions deleted");
          fn(null);
        });
      });
  });
}
```
In model/manageSessions.js we have the code below that creates the HMAC digest that will be used to validate the session cookie. I would like to highlight that the underlying hash function is a SHA-256.

```javascript
function createDigest (sessionId) {
  const hmac = crypto.createHmac("sha256", require("./manageHMACSecretKey.js").secretKey);
  hmac.update(sessionId)
  return hmac.digest("hex");
}
```
Note that the key length chosen for the HMAC is simply 32 bytes. 32 bytes when represented as a hexadecimal string is 64 characters long. That is why `keyString.length !== 64` which serves to verify the length of the secret key from the text appears in the code above. RFC 2104 states that a HMAC with a keylength that is smaller than the byte-length of hash output would reduce the security of the function [7]. I have thus chosen to go with 32 bytes as that is the byte length of the output of SHA-256.

#### 2) Hashing and salting user passwords
We hash passwords so if our database is compromised, the attacker would not have access to the plaintext passwords. Hashing the password is done so that the attacker could not use the username and password on other websites as users are likely to use the same username and password across multiple websites. However that is not enough. There exist lookup tables and reverse lookup tables to tackle password hashes. Just hashing by itself does not work against lookup tables as the same given password produces the same hash. Similarly, simply hashing does not work against reverse lookup tables as multiple users with the same password would have the same password hash.

This is why we salt the password by appending a random string to the end of the password and then hashing it. It ensures that no two same passwords produce the same hash. This negates lookup tables and rainbow tables which are like lookup table optimized for memory storage rather than lookup speed [8].

In keeping with the theme of trying to only use built-in modules, I used node's inbuilt crypto module to hash the password. I choose to use randomBytes to generate the salt as it produces a cryptographically secure pseudo random number. You can think of a cryptographically secure pseudo random number as meaning you cannot predict what the next output will be given all of the outputs before it [9]. I went with pbkdf2 to hash the passwords because a normal hash like SHA-1 is too fast. Pbkdf2 is purposely slowed by giving it a large iteration count.

##### On the arguments chosen for Pbkdf2
`crypto.pbkdf2(password, salt, 1000, 32, "sha256", function (err, hashPasswordBuffer) {`

I went with the default iteration count value of 1000 even though I know that it may not be sufficient (it was recommended when pbkdf2 was released years ago and computing power has long caught up with that iteration count) because I did not want to set too high a value for older and weaker systems. By all means experiment with a higher value that is sufficient for your machine and needs.

The key length parameter (32 bytes) was chosen so that it equals the output length of sha256. If the key length is less than the output length of sha256 it saves you no computations. However, if the key length is greater, it costs you more computing power. In this case it would go through 1000 iterations adding 32 bytes to the key each time until it equals the key length desired. To the attacker there is no such cost as he would just hash his password guess and salt and compare it to the first 32 bytes output by pbkdf2 [10].

I choose sha256 for the digest as it is simply more likely to be supported although as [10] suggests, sha512 would be a safer choice as GPU's do not do 64-bit operations as well.

#### 3) Closing remarks on security
I chose to place the security section last because although I have done a lot of reading and research, I am not very confident of the security of my current system. Ironically, the more about security I read, the less sure I become as I discover new attack vectors. The problem is that as the person defending against security attacks, we have to defend against all possible attack vectors while the attacker is simply looking for one that works.

In model/manageUsers.js we have the following code `fn(null, hashedProbablePassword === userObject.hashedPassword);`. This is the code that tests the hash of the supplied password against the hash of the actual password in the database. Since I am using strict equality `===` for the comparison, I have still left myself open to timing attacks as I check for validity of the user input. So I feel like attack vectors just keep cropping up and at this point I do not even know what I do not know. I am glad that I have made some attempt to write secure code but I fear that there is a glaring and serious security concern I have overlooked.
___

## References
1. [Peter-Paul Koch on native form validation](https://medium.com/samsung-internet-dev/native-form-validation-part-1-bf8e35099f1d)
2. [Mongo documents on Sort and Non-prefix Subset of an Index](https://docs.mongodb.com/manual/tutorial/sort-results-with-indexes/#sort-and-non-prefix-subset-of-an-index)
3. [Mongo documents on covered queries](https://docs.mongodb.com/manual/core/query-optimization/#read-operations-covered-query)
4. [MDN on Date.parse() and passing in date strings to the Date constructor (they are equivalent)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)
5. [How Browserify works by Ben Clinkinbeard](https://benclinkinbeard.com/posts/how-browserify-works/)
6. [Christof Paar on HMACs](https://youtu.be/DiLPn_ldAAQ?t=2086)
7. [RFC 2104 on the key length of HMACs](https://tools.ietf.org/html/rfc2104#section-3)
8. [Crackstation Salted Password Hashing - Doing it Right](https://crackstation.net/hashing-security.htm)
9. [Christof Paar on cryptographically secure pseudo random number generators](https://youtu.be/AELVJL0axRs?t=3249)
10. [Information Security Stack Exchange, Parameters for PBKDF2 for password hashing](https://security.stackexchange.com/questions/110084/parameters-for-pbkdf2-for-password-hashing)
