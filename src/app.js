const express = require("express");
const path = require("path");
require("./db/conn");
const UserRegister = require("./models/userReg");
const bcrypt = require('bcrypt');
const hbs = require("hbs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //to show the data` when form submits

const static_path = path.join(__dirname, "../public/");
// console.log(static_path);
app.use(express.static(static_path)); //with this it will show our static file that is index.html
// const template_path = path.join(__dirname, '../views');
// const partials_path = path.join(__dirname, '../templates/partials');

app.set("view engine", "hbs");
// app.set('views', template_path);
// hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  // res.send("hello");
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

//                                           Register Validation


app.post("/register", async (req, res) => {
  // try {
  //   console.log(req.body.UserName); //exact name field u hv to write so it will show only name
  //   res.send(req.body.UserName);
  // } catch (err) {
  //   res.send(err);
  // }

  try {
    const userPassword = req.body.password;
    const confirmPassword = req.body.cpassword;

    if (userPassword === confirmPassword) {
      //if matched then show all field datd

      const userRegistered = new UserRegister({
        UserName: req.body.UserName,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        password: req.body.password,
        // cpassword: req.body.cpassword //there is no need to show cpassword again
      });

      // this line's code is in schema section bcz we want thatt before saving our data into db , our pswd should
      // hashed. SO after register and before save.


      const registered = await userRegistered.save();
      res.render("index");
    } else {
      res.status(400).send("Password do not match!!!");
    }
  } catch (err) {
    res.status(400).send(err);
  }
  // res.render('register');
});

//                               Login Validation




app.post("/login", async (req, res) => {
  try {
    const loginEmail = req.body.email; //whatever we r writing in email of login page
    const loginPassword = req.body.password;

    const userEmail = await UserRegister.findOne({ email: loginEmail }); //check email existence and it will give all info of the reg email.
    // console.log(userEmail);
    // res.send(userEmail);
  
      const isMatch = await bcrypt.compare(loginPassword, userEmail.password); //will return true;
      
      // if (userEmail.password === loginPassword) {
    // in this if condition it was matching with normal pswd saved in db but now its hashed
        
        if(isMatch){ //now we are matching with the hashed passwords
      //if pswrd matched with our reg pass then render
      res.render("index");
    } else {
      res.send("Password do not match!!!"); //if not matched with our reg pass
    }
  } catch (err) {
    res.send("Invalid email , Please Register First!!!");
    console.log(err);
  }
});

//                                           All about bcrypt.js



// const bcrypt = require("bcrypt");
// // console.log(bcrypt);

// const securePswd = async(pswd) => {

//   const scpswd = await bcrypt.hash(pswd, 10);
//   console.log(scpswd); //it will show hashed password

//   const pswdMatch = await bcrypt.compare('satyam', scpswd); //will return true;
//   console.log(pswdMatch);
// }

// securePswd("satyam");



//                                          JWT(json web tokens)

const jwt = require('jsonwebtoken');
// console.log(jwt);
// 60e4013b3713a61adc902917


const createToken = async () => {
  // jwt.sign(payload,"secret key")
  const token = await jwt.sign({ _id: '60e4013b3713a61adc902917' }, "HiTHisissatyammishraherefrombastiuphowareyou",
  { expiresIn:"2h" } ); //it will tell page's expiry date
  console.log(token);

  const userVerification = await jwt.verify(token, "HiTHisissatyammishraherefrombastiuphowareyou"); //user verifiaction
  console.log(userVerification);
}




createToken();















const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at  ${PORT}`);
});
