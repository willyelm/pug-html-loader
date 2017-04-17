/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Williams Medina @willyelm
*/
'use strict'
const util = require('loader-utils')
const pug = require('pug')

module.exports = function (source) {
  let query = {}
  if (this.cacheable) {
    this.cacheable(true)
  }
  if (typeof this.query === 'string') {
    query = util.parseQuery(this.query)
  } else {
    query = this.query
  }
  let req = util.getRemainingRequest(this)
  let options = Object.assign({
    filename: this.resourcePath,
    doctype: query.doctype || 'js',
    compileDebug: this.debug || false
  }, query)
  if (options.plugins){
    if (typeof options.plugins === 'string') {
      options.plugins = [options.plugins];
    }
    if (Array.isArray(options.plugins)) {
      options.plugins = options.plugins.map(function (plugin) {
        return require(plugin);
      });
    }
  }
  let template = pug.compile(source, options)
  template.dependencies.forEach(this.addDependency)
  let data = typeof query.data === 'object' ? query.data : JSON.parse(query.data || '{}');
  return template(data)
}
