const pHash = require('password-hash');
const models = require('../models/');
const Boom = require('boom');
const secretKey = require('../secret');
const jwt = require('jsonwebtoken');

const users = {
  all: function (req, res) {
    models.Users.findAll({
      attributes: ['username', 'email', 'id', 'activated', 'type', ['UserId', 'mentor']]
    })
      .then(function (users) {
        res(users).code(200);
      });
  },
  find: function (req, res) {
    models.Users.find({
      where: {id: req.params.id},
      attributes: ['username', 'email', 'id', 'activated', 'type', ['UserId', 'mentor']]
    }).then(user => {
      res(user).code(200);
    });
  },
  mentored: (req, res) => {
    console.log(req.auth.credentials);
    models.Users.findAll({
      where: { UserId: req.auth.credentials.id },
      include: [
        {
          model: models.daily_task,
          include: [{model: models.why}]
        },
        {
          model: models.weekly_task,
          include: [{model: models.why}]
        },
        {
          model: models.monthly_task,
        }
      ]
    })
      .then(users => {
        res(users).code(200);
      });
  },
  create: (req, res) => {
    const u = req.payload;
    u.password = pHash.generate(u.password);
    u.activated = 0;
    u.type = 'user';
    models.Users.create(req.payload)
      .then(user => {
        user.password = undefined;
        res(user).code(200);
      })
      .catch(error => {
        const err = Boom.notAcceptable(error.message, error.errors);
        err.output.payload.details = err.data;
        res(err);
      });
  },
  promote: (req, res) => {
    models.Users.update(
      {type: 'admin'},
      {where: {id: req.params.id, activated: 1}}
    ).then(() => {
      users.find(req, res);
    }).catch(error => {
      const err = Boom.notAcceptable(error.message, error.errors);
      err.output.payload.details = err.data;
      res(err);
    });
  },
  activate: (req, res) => {
    models.Users.update(
      {activated: 1},
      {where: {id: req.params.id, activated: 0}}
    ).then(() => {
      users.find(req, res);
    }).catch(error => {
      const err = Boom.notAcceptable(error.message, error.errors);
      err.output.payload.details = err.data;
      res(err);
    });
  },
  deActivate: (req, res) => {
    models.Users.update(
      {activated: 0},
      {where: {id: req.params.id, activated: 1}}
    ).then(() => {
      users.find(req, res);
    }).catch(error => {
      const err = Boom.notAcceptable(error.message, error.errors);
      err.output.payload.details = err.data;
      res(err);
    });
  },
  setMentor: (req, res) => {
    models.Users.update(
      {UserId: req.payload.mentor},
      {where: {id: req.params.id}}
    ).then(() => {
      users.find(req, res);
    }).catch(error => {
      const err = Boom.notAcceptable(error.message, error.errors);
      err.output.payload.details = err.data;
      res(err);
    });
  },
  login: (req, res) => {
    models.Users.findOne({
      where: {username: req.payload.username}
    }).then(user => {
      if (!user) {
        res(Boom.unauthorized('Invalid credentials'));
      }
      const check = pHash.verify(req.payload.password, user.password);
      if (check) {
        if (user.activated === 1) {
          const token = user.token;
          user = {
            username: user.username,
            id: user.id,
            mentor: user.UserId,
            type: user.type
          };
          req.server.app.cache.set(token, {user}, 0, () => {
            const auth = jwt.sign({token}, secretKey);
            res({user, auth});
          });
        }
        else {
          res(Boom.unauthorized('User not activated, contact an admin to enable your access'));
        }
      }
      else {
        res(Boom.unauthorized('Invalid password'));
      }
    });
  }
};
module.exports = users;
