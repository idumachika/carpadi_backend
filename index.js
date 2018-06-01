/************************************
 * Church App                       *
 * Copyright(c) 2018 (TSS) Team 2   *
 ***********************************/

// 'use strict';
const   app              = require('./app'),
        http             = require('http'),
        log              = require('./util/logger').getLogger('APP');


/***************************
 * HTTP server instance    *
 **************************/

const server = http.createServer(app);

/********************
 * Module variables *
 ********************/
const
    port = app.get('port'),
    env = app.get('env');


/****************
 * Bind to port *
 ***************/
server.listen(port, () => {
    log.info(`Server up on ${port} in ${env} mode`);
});

        /**
         * Conditionally export module
         */
        //=============================================================================
        if(require.main != module) {
            module.exports = server;
        }
        //=============================================================================
        

