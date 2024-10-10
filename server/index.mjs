// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {check, param, validationResult} from 'express-validator';
import Dao from './dao.mjs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

const dao = new Dao();

// init express
const app = new express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));


passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await dao.getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { 
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/* ROUTES */
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});


app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});


app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

async function updateUsersTokens() {
  try {
    const {id,timestamp,int1,int2,int3,int4,int5} =  await dao.getLastDraw();
    const numbersD = [int1, int2, int3, int4, int5];
    const bets = await dao.getBets(id);

    if(bets){
      for (let bet of bets) {
        const {userId,n1,n2,n3} = bet
        let numbersN = [n1, n2, n3];
        numbersN = numbersN.filter(n => n !== null);
        const countMatchingNumbers = numbersN.filter(n => numbersD.includes(n)).length;
    
        const {tokens} = await dao.getUserTokens(userId);
        const newtokens = tokens + countMatchingNumbers*10
        if(tokens!==newtokens){
          await dao.updateUserTokens(userId,newtokens)
        }  
      }
    }
    console.log("userTokens updated");
  }
  catch (err) {
    console.error('Error updating user tokens:', err.message);
  }
}

setInterval(async () => {
  try {
    await dao.addDraw();
    await updateUsersTokens();
  } catch (err) {
    console.error('Error during scheduled draw:', err.message);
  }
}, 120000);

app.post('/api/bet', isLoggedIn, [
  check('bet').isArray({ min: 1, max: 3 }).withMessage('numbers must be an array with 1 to 3 numbers.'),
  check('bet.*').isInt({ min: 1, max: 90 }).withMessage('Each number must be between 1 and 90.')
], async (req, res) => {
  const userId = req.user.id;
  const { bet } = req.body; 
  const numbersN = bet.filter(n => n !== null);
  const [n1 = null, n2 = null, n3 = null] = numbersN;

  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {id,timestamp,int1,int2,int3,int4,int5} =  await dao.getLastDraw();
    const drawId = id +1;

    let {tokens} = await dao.getUserTokens(userId);
    if(tokens<numbersN.length*5){
      return res.status(403).json({ error: 'not enough tokens for the bet.' });
    }

    const checkIfBet = await dao.getBet(userId,id+1);
    if(checkIfBet!==null){
      return res.status(403).json({ error: 'user already betted.' });
    }
    
    await dao.addBet(userId,drawId,n1,n2,n3);
    tokens= tokens - numbersN.length*5;
    await dao.updateUserTokens(userId,tokens);
    res.status(200).json({userId: userId,tokens: tokens, bet: [n1,n2,n3]});
  }
  catch{
    res.status(500).json({ error: 'Error betting.' });
  }

});

let syncTimestamp;

app.get('/api/round', isLoggedIn, async (req,res)=>{
  const userId = req.user.id;

  try {
    const {id,timestamp,int1,int2,int3,int4,int5} =  await dao.getLastDraw();
    const n = await dao.getBet(userId,id)
    let numbersN =  n ? Object.values(n) : [];
    numbersN = numbersN.filter(n => n !== null);

    let numbersD = [int1, int2, int3, int4, int5];
    numbersD = numbersD.filter(n => n !== null);
    const countMatchingNumbers = numbersN.filter(n => numbersD.includes(n)).length;

    const {tokens} = await dao.getUserTokens(userId);
    const gainedTokens = countMatchingNumbers*10 
    const isOldTimestamp = timestamp === null || (new Date()- new Date(timestamp)) > 120 * 1000;

    res.status(200).json({
      draw: numbersD,
      bet: numbersN,
      timestamp: isOldTimestamp ? syncTimestamp : timestamp,
      tokens: tokens,
      gainedTokens: gainedTokens
    })

  } catch (err) {
      res.status(500).json({ error: 'Error getting the result.' });
  }

});

app.get('/api/top3',isLoggedIn, async (req, res) => {
  try {
    const users = await dao.top3Users();
    res.status(200).json(users); 
  } catch (err) {
    res.status(500).json({ error: 'Error getting top 3 users' });
  }
});


// activate the server
app.listen(port, async () => {
  console.log(`Server listening at http://localhost:${port}`);
  syncTimestamp= new Date();
  //dao.clearDraws();
});