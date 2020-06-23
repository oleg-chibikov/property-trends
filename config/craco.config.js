'use strict';

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
var webpack = require('webpack');
var fs = require('fs');

var geoFiles = [];

const files = fs.readdirSync('./public/geo', { withFileTypes: true });
files
  .filter((dirent) => dirent.isFile())
  .forEach((file) => {
    geoFiles.push(file.name);
  });

console.log(geoFiles);

module.exports = {
  webpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.GEO_FILES': "'" + geoFiles.join('|') + "'",
      }),
    ],
  },
};
