/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Williams Medina @willyelm
*/
'use strict'
const util = require('loader-utils')
const pug = require('pug')

module.exports = function (source) {
  if (this.cacheable) {
    this.cacheable(true)
  }
  let query = loaderUtils.getLoaderConfig(this, "pugHtmlLoader") || {};
  let req = util.getRemainingRequest(this)
  let options = Object.assign({
    filename: this.resourcePath,
    doctype: query.doctype || 'js',
    compileDebug: this.debug || false
  }, query)
  if (options.plugins){
    if (typeof options.plugins === 'object') {
      options.plugins = [options.plugins];
    }
  }
  let template = pug.compile(source, options)
  template.dependencies.forEach(this.addDependency)
  let data = query.data || {}
  return template(data)
}
