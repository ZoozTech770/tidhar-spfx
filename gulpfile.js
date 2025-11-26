'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
build.addSuppression(/filename should end with module\.sass or module\.scss/);
build.addSuppression(/end value has mixed support, consider using flex-end instead/);
build.addSuppression(/There are multiple modules with names that only differ in casing/);
build.addSuppression(/caniuse-lite is outdated/);
// const fontLoaderConfig = {
//   test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
//   use: [{
//     loader: 'file-loader',
//     options: {
//       name: '[name].[ext]',
//       outputPath: '/'
//     }
//   }]
// };

// build.configureWebpack.mergeConfig({
//   additionalConfiguration: (generatedConfiguration) => {

//     //generatedConfiguration.module.rules.push(fontLoaderConfig);
//     //if (build.getConfig().production) {
//       //var basePath = build.writeManifests.taskConfig.cdnBasePath;
//       //if (!basePath.endsWith('/')) {
//         //  basePath += '/';
//       //}
//     //  generatedConfiguration.output.publicPath = basePath;
//   //}
//   //else {
//       generatedConfiguration.output.publicPath = "/dist/";
//   //}
//     return generatedConfiguration;

//  }
// });
var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.initialize(require('gulp'));
