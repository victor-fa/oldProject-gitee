var express = require('express')
var router = express.Router()
var gallery = require('node-gallery')

/*
@param {string, required} staticFiles The directory where your album starts - can contain photos or images
@param {string, required} urlRoot The root URL which you pass into the epxress router in app.use (no way of obtaining this otherwise)
@param {string, optional} title Yup, you guessed it - the title to display on the root gallery
@param {boolean, optional} render Default to true. If explicitly set to false, rendering is left to the next function in the chain - see below. 
@param {string, optional} thumbnail.width Thumbnail image width, defaults '200'
@param {string, optional} thumbnail.height as above
@param {string, optional} image.width Large images width defaults '100%'
@param {string, optional} image.height as above
*/
router.get('*', gallery({
	staticFiles : 'resources/albums',
	urlRoot : 'gallery', 
	title : 'Images',
	render: false
}), function(req, res, next) {
	// console.log(req.data)
	// res.render('image/delete.handlebars',req.html)
	res.send(req.data)
	if (next) {
        next();
    }
})

module.exports = router
