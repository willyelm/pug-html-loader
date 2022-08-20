/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Williams Medina @willyelm
*/
'use strict'
const util = require('loader-utils')
const pug = require('pug')

let cachedDeps;

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
    doctype: query.doctype || 'html',
    compileDebug: this.debug || false
  }, query)
  if (options.plugins){
    if (!(options.plugins instanceof Array)) {
      options.plugins = [options.plugins];
    }
  }
  let template;
  try {
    template = pug.compile(source, options);
  } catch (ex) {
    cachedDeps.forEach(this.addDependency);
    this.callback(ex);
    return;
  }
  cachedDeps = template.dependencies ? template.dependencies.slice() : undefined;
  template.dependencies.forEach(this.addDependency)
  let data = query.data || {}
  return template(data)
}
