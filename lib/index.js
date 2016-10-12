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

  let query = util.parseQuery(this.query)
  let req = util.getRemainingRequest(this)
  let options = Object.assign({
    filename: this.resourcePath,
    doctype: query.doctype || 'js',
    compileDebug: this.debug || false
  }, query)
  let template = pug.compile(source, options)
  let data = query.data || {}
  let html = template(data)
  if (query.exports === false) {
    return html
  } else {
    let content = JSON.stringify(html)
    return `module.exports = ${content};`
  }
}
