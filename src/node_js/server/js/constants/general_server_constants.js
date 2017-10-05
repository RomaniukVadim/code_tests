'use strict';

const SERVER_PORT = 3000;
const SERVER_DOMAIN = 'localhost';

const PUBLIC_DIRECTORY_PATH = '.';

const HTML_PAGES_DIRECTORY_PATH = `${PUBLIC_DIRECTORY_PATH }/pages`;
const RESOURCES_DIRECTORY_PATH = `${PUBLIC_DIRECTORY_PATH }/resources`;

const MAX_POST_DATA_SIZE = 1e6;

module.exports.SERVER_PORT = SERVER_PORT;
module.exports.SERVER_DOMAIN = SERVER_DOMAIN;

module.exports.HTML_PAGES_DIRECTORY_PATH = HTML_PAGES_DIRECTORY_PATH;
module.exports.RESOURCES_DIRECTORY_PATH = RESOURCES_DIRECTORY_PATH;

module.exports.MAX_POST_DATA_SIZE = MAX_POST_DATA_SIZE;