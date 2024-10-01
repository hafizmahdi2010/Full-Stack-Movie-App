var express = require('express');
var router = express.Router();
var userModel = require("../models/userModel");
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const multer = require('multer')
var movieModel = require("../models/movieModel");

const secret = "secret"; // secret key for jwt

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/signUp", async (req, res) => {
  let { username, name, email, password } = req.body;
  let emailCon = await userModel.findOne({ email });
  if (emailCon) {
    return res.json({
      success: false,
      msg: "Email already exists"
    });
  } else {
    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) throw err;
        else {
          let user = await userModel.create({
            name,
            username,
            email,
            password: hash
          });
          return res.json({
            success: true,
            msg: "User created successfully",
            userId: user._id
          })
        }
      });
    });
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  // Find the user by email
  let user = await userModel.findOne({ email });
  if (!user) {
    return res.json({
      success: false,
      msg: "User not found"
    });
  } else {
    // Compare the passwords using bcrypt
    bcrypt.compare(password, user.password, function (err, isMatch) { // Renamed 'res' to 'isMatch'
      if (err) throw err;

      if (isMatch) {
        // Create the JWT token
        var token = jwt.sign({ email: user.email, userId: user._id }, secret);

        // Send the response with the token
        return res.json({
          success: true,
          msg: "User logged in successfully",
          userId: user._id,
          token: token
        });
      } else {
        // Incorrect password
        return res.json({
          success: false,
          msg: "Invalid password"
        });
      }
    });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Ensure the uploads folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]; // Adding the extension based on the MIME type
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

router.post("/uploadMovie", upload.single('movieImg'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      msg: "No image file uploaded"
    });
  }

  // Extract only the filename instead of the full path
  const imgFilename = req.file.filename;

  // Create a new movie document
  const newMovie = await movieModel.create({
    title: req.body.title,
    desc: req.body.desc,
    img: imgFilename,  // Save only the filename, not the full path
    video: req.body.video
  });

  return res.json({
    success: true,
    msg: "Movie created successfully",
    movieId: newMovie._id
  });
});

router.get("/getMovies", async (req, res) => {
  const movies = await movieModel.find({});
  if (movies.length > 0) {
    return res.json({
      success: true,
      movies: movies
    });
  } else {
    return res.json({
      success: false,
      msg: "No movies found"
    });
  }
});

router.post("/getMovie", async (req, res) => {
  let { movieId, userId } = req.body;
  let user = await userModel.findById(userId);
  const movie = await movieModel.findById(movieId);

  if (movie) {
    let fullMovieData = [{
      username: user.username,
      name: user.name,
      moveId: movieId,
      title: movie.title,
      desc: movie.desc,
      img: movie.img,
      video: movie.video,
      date: movie.date,
      comments: movie.comments
    }];

    return res.json({
      success: true,
      movie: fullMovieData
    })
  }
  else {
    return res.json({
      success: false,
      msg: "Movie not found"
    });
  }
});


router.post("/createComment", async (req, res) => {
  let { movieId, userId, comment } = req.body;

  // Find the movie by ID
  let movie = await movieModel.findById(movieId);

  if (movie) {
    // Check if the user exists
    let user = await userModel.findById(userId);

    if (user) {
      // No need to initialize comments, since it's now an array in the schema
      movie.comments.push({
        commentBy: userId,  // Make sure the field matches your schema
        comment: comment,
        username: user.name,
      });

      // Save the updated movie document
      await movie.save();

      return res.json({
        success: true,
        msg: "Comment created successfully"
      });
    } else {
      return res.json({
        success: false,
        msg: "User not found"
      });
    }
  } else {
    return res.json({
      success: false,
      msg: "Movie not found"
    });
  }
});

router.post("/getUserDetails", async (req, res) => {
  let { userId } = req.body;
  let user = await userModel.findById(userId);
  if (user) {
    return res.json({
      success: true,
      user: user
    });
  }
  else {
    return res.json({
      success: false,
      msg: "User not found"
    });
  };
});

router.post("/checkAdmin", async (req, res) => {
  let { userId, email, password, key } = req.body;
  let user = await userModel.findById(userId);
  if (user) {
    if (user.email === email) {
      bcrypt.compare(password, user.password, function (err, isMatch) { // Renamed 'res' to 'isMatch'
        if (err) throw err;
        if (isMatch) {
          if (key === "admin") {
            return res.json({
              success: true,
              msg: "Admin is verified"
            });
          }
          else {
            return res.json({
              success: false,
              msg: "You are not an admin"
            })
          }
        }
      });
    }
    else {
      return res.json({
        success: false,
        msg: "Email is not correct"
      })
    }
  }
})

module.exports = router;
