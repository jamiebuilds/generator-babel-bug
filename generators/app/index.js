'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function() {
    var done = this.async();

    function split(val) {
      return val === '' ? [] : val.split(/,[\s+]?/);
    }

    var prompts = [{
      name: 'name',
      message: 'What is the name of this bug?',
      validate: function(val) {
        return val.length > 0 ? true : 'You have to provide a name';
      }
    }, {
      type: 'confirm',
      name: 'needsPlugin',
      message: 'Do you need a custom plugin?',
      default: false
    }, {
      name: 'presets',
      message: 'Do you need any presets? (comma-seperated)',
      filter: split
    }, {
      name: 'plugins',
      message: 'Do you need any plugins? (comma-seperated)',
      filter: split
    }];

    this.prompt(prompts, function(props) {
      console.log(props);
      this.props = props;
      done();
    }.bind(this));
  },

  writing: function() {
    this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), this.props);
    this.fs.copyTpl(this.templatePath('babelrc'), this.destinationPath('.babelrc'), this.props);
    this.fs.copyTpl(this.templatePath('gitignore'), this.destinationPath('.gitignore'), this.props);
    this.fs.copyTpl(this.templatePath('index.js'), this.destinationPath('index.js'), this.props);
    if (this.props.needsPlugin) {
      this.fs.copyTpl(this.templatePath('plugin.js'), this.destinationPath('plugin.js'), this.props);
    }
    this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), this.props);
  },

  install: function() {
    var devDependencies = ['babel-cli'];

    this.props.presets.forEach(function(name) {
      devDependencies.push('babel-preset-' + name);
    });

    this.props.plugins.forEach(function(name) {
      devDependencies.push('babel-plugin-' + name);
    });

    this.npmInstall(devDependencies, {
      saveDev: true
    });
  }
});
