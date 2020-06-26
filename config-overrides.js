/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
'use strict';

module.exports = function override(config, env) {
  //do stuff with the webpack config...

  console.log(config);
  const webpack = require('webpack');
  const fs = require('fs');

  var geoFiles = [];

  const files = fs.readdirSync('./public/geo', { withFileTypes: true });
  files
    .filter((dirent) => dirent.isFile())
    .forEach((file) => {
      geoFiles.push(file.name);
    });

  console.log(geoFiles);
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.GEO_FILES': "'" + geoFiles.join('|') + "'",
    })
  );

  return config;
};
