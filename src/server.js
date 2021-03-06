/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { UnauthorizedError as Jwt401Error } from 'express-jwt';
import fetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createFetch from './createFetch';
import router from './router';
import models from './data/models';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import config from './config';
import authUser from "./services/auth";
import {allTokens, createToken, fetchBalance, myTokens, purchaseToken, tokenById, fetchBtcBalance} from "./services/tokens"
import {uploadFile, uploadMulter} from "./services/files";

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
/*
app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
  }),
);
*/
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});

// app.use(passport.initialize());

if (__DEV__) {
  app.enable('trust proxy');
}


app.get('/callback', (req, res) => {
  res.redirect('/list-tokens')
});

/*
app.get(
  '/login/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'user_location'],
    session: false,
  }),
);
app.get(
  '/login/facebook/return',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, config.auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  },
);
*/
app.use("/files", express.static('files'));

app.post("/token/create", authUser, createToken);
app.get("/tokens", authUser, allTokens);
app.get("/my-tokens", authUser, myTokens);
app.get("/token/:tokenId", authUser, tokenById);
app.post("/token/:tokenId/purchase/:amount", authUser, purchaseToken);
app.get("/fetch-balance/token/:tokenId", authUser, fetchBalance);
app.get("/fetch-balance/btc", authUser, fetchBtcBalance);
app.post("/file/upload", authUser, uploadMulter.single('file'), uploadFile);

// app.use(checkJwt);

const RSKTest = async () => {
  const now = new Date();
  const RSKService = require('./services/RSKService').default;
  console.log("starting...");
  const rskService = new RSKService("0xb7c7ddee89a42e14069862443dd4ae56baea704a");
  console.log("rskService done");
  // console.log("transferEther", await rskService.transferEther("0x0e082742330d4a06ef127ca89f78f7283141c572", "0xb7c7ddee89a42e14069862443dd4ae56baea704a", 1e-3));
  /* var crowdsaleInstance = await rskService.deployCrowdsale({
    tokenName: "My Token",
    tokenSymbol: "TKN",
    startTime: new Date(now.getTime() + 30 * 1000),
    endTime: new Date(2018, 2, 0),
    rate: 2,
    goal: 10e-18, // in BTC
    cap: 20e-18, // in BTC
    wallet: "0x0e082742330d4a06ef127ca89f78f7283141c572",
    onSent: (contract) => {
      console.log("Contract sent");
    },
  });
  console.log('CrowdsaleRskAddress: ', crowdsaleInstance.address);
  console.log('TokenRskAddress: ', rskService.token.address); */
  // rskService.loadCrowdsaleAt("0xa0090ced73dbef8abbde8f39421c08d0d111432c");
  // console.log("rsk.crowdsale.cap(): ", rskService.crowdsale.cap());
  // console.log('Token: ', crowdsaleInstance.address);*/
  // rskService.loadCrowdsaleAt("0xdf05a424f3903ae6f1ecf69497a6a10601dc94c9");
  // console.log(rskService.token);
  // console.log(rskService.buyTokens("0x0e082742330d4a06ef127ca89f78f7283141c572", 7e-18));
  // console.log(rskService.tokenBalance("0x0e082742330d4a06ef127ca89f78f7283141c572"));
  // console.log("rsk.crowdsale.weiRaised(): ", rskService.crowdsale.weiRaised());
  // console.log("rsk.crowdsale.goalReached(): ", rskService.crowdsale.goalReached());
  // console.log("rsk.crowdsale.hasEnded(): ", rskService.crowdsale.hasEnded());
  // console.log("account: ", await rskService.createAccount());

}

const BTCTest = async () => {
  const RSKService = require('./services/RSKService').default;
  const rskService = new RSKService("0xf773053f6935097866cb532bf22886d67a9fce3c");
  rskService.loadCrowdsaleAt("0x2ceea12bec12add413b5f039a0d15cc075027f9c");
  console.log("rskService done");

  const BTCService = require('./services/BTCService').default;
  const btcService = new BTCService();
  // console.log("getBalance", await btcService.getBalance("mxjDWHNR7pSuXwGYakjqZsWmsPi1GLV4vR", 0));
  // console.log("btcService.sendFrom: ", await btcService.sendFrom("mybLjNKLvHdvpqgSVnKFhpiMtfsgTzX9RQ", "mxjDWHNR7pSuXwGYakjqZsWmsPi1GLV4vR", 0.01));
  // console.log("buyTokens", await btcService.buyTokens("mxjDWHNR7pSuXwGYakjqZsWmsPi1GLV4vR", "0xf773053f6935097866cb532bf22886d67a9fce3c", 1e-5, rskService));
  // console.log("balance", rskService.tokenBalance("0xf773053f6935097866cb532bf22886d67a9fce3c"));
  // const address = "mfadMfxwXKD4vg22ESTBNxaQ9eqq8LPCG1";
  // const balance = await btcService.getBalance(address, 0);
  // console.log("balance: ", balance);
  // console.log("transferToRSK", await btcService.transferToRSK(address, "0x52faf23d8ba4b21e1ff6260fcd043d9411afb9c5", 1e-5, rskService));
  // console.log(btcService.createAccount());

  // TODO: Not secure, should move to client side
  // console.log("importKeys", await btcService.importKeys(address, pkey));
  // console.log("dumpPrivateKey", await btcService.dumpPrivateKey(address));
  // console.log("sendToAddress", await btcService.sendToAddress("mxjDWHNR7pSuXwGYakjqZsWmsPi1GLV4vR", 1));
}

app.get('/test', async (req, res, next) => {
  BTCTest();
  // RSKTest();
  res.send('done');
});

//
// Register API middleware
// -----------------------------------------------------------------------------
/* app.post(
  '/graphql',
  checkJwt,
  expressGraphQL(async req =>  {
      const idToken = req.headers.id_token;

      const verify = new JWTVerify();
      await verify.updateKeys();
      verify.validate(idToken, (err, data) => {
        console.log("err = ", err);
        console.log("data = ", data);

      });

      return {
        schema,
        graphiql: __DEV__,
        rootValue: { request: req },
        pretty: __DEV__,
      }
    },
  )
); */




//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      // Universal HTTP client
      fetch: createFetch(fetch, {
        baseUrl: config.api.serverUrl,
        cookie: req.headers.cookie,
      }),
    };

    const route = await router.resolve({
      ...context,
      pathname: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };

    data.children = ReactDOM.renderToString(

      <App context={context}>{route.component}</App>,

    );

    data.styles = [{ id: 'css', cssText: [...css].join('') }];
    data.scripts = [assets.vendor.js];
    if (route.chunks) {
      data.scripts.push(...route.chunks.map(chunk => assets[chunk].js));
    }
    data.scripts.push(assets.client.js);
    data.app = {
      apiUrl: config.api.clientUrl,
    };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});



//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
    {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
// const promise = models.sync().catch(err => console.error(err.stack));
models.initRelations();
if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
/*
  promise.then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
*/
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
