const User = require('../models/User')
const axios = require('axios');

exports.login = function(req, res) {
    let user = new User(req.body)
    user.login().then(function(result) {
      req.session.user = {username: user.data.username}
      req.session.save(function() {
        res.redirect('/')
      })
    }).catch(function(e) {
        req.flash('err', e)
      req.session.save(function() {
        res.redirect('/')
      })
    })
  }

exports.logout = function(req, res){
    req.session.destroy(function(){
        res.redirect('/')
    })
    
}

exports.register = function(req, res){
    let user = new User(req.body)
    user.register().then(() => {
        req.session.user = {username: user.data.username}
        req.session.save(function(){
            res.redirect('/')
           })
    }).catch((regErrors) => {
        regErrors.forEach(function(error){
            req.flash('regErrors', error)
           })
           req.session.save(function(){
            res.redirect('/')
           })
    })
}

exports.home = async function(req, res) {
    if (req.session.user) {
      try {
        // Make a GET request to the API using Axios
        const response = await axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5');
    
        // Extract the relevant data from the response
        const dataFromAPI = response.data;
    
        // Render the EJS view and pass the data as a variable
        res.render('home-dashboard', {username: req.session.user.username, dataFromAPI: dataFromAPI})
      } catch (error) {
        console.error('Error fetching data from API:', error);
        res.status(500).send('Internal Server Error');
      }
      
    } else {
      res.render('home-guest', {errors: req.flash('err'), regErrors: req.flash('regErrors')})
    }
  }

