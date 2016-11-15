"use strict"

const express = require('express');
const app = express();
const fs = require('fs');
const queryString = require('querystring');

const port = 8080;
const hostname = "localhost";

function start() {
    app.listen(port, onStart());
    
    app.use(function(req, res, next) {    
        console.log('Request Type: ', req.method);
        console.log('Request URL: ', req.originalUrl);
        next();
    });
    
    app.get('/', function(req, res, next) {
        console.log("Logged, Welcome !");
        let fileName = "../index.html";
        responseHTML(res, fileName);
    });

    app.post('/login', function(req, res, next) {
        let chunkData = [];

        req.on('data', function onData(chunk) {
            chunkData.push(chunk);
        });

        req.on('end', function onEnd() {
            let postData = chunkData.join("");
            let formData = queryString.parse(postData);
            let fileName = isValidUser(formData.username, formData.secretword) 
                       ? "../success.html" : "../access-denied.html";
            responseHTML(res, fileName);
        });
    });

    function responseHTML(response, fileName) {
        fs.readFile(fileName, "utf-8", function onReturn(error, data) {
            if(error) throw error;
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html");
            response.write(data);
            response.end();
        });
    };

    app.get('*', function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        res.send("404 Not Found");
    });

    function isValidUser(username, secretword) {
        return (username === 'Sabrina Andrade' && secretword === 'saescola12');
    };
};

function onStart() {
    console.log(`Server started at http://${hostname}:${port}`);
};

exports.start = start;