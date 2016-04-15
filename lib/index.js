/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Williams Medina @willyelm
*/
'use strict'
const util = require('loader-utils')
const pug = require('pug')

module.exports = function (source) {
  this.cacheable && this.cacheable(true)
  let query = util.parseQuery(this.query)
  let req = util.getRemainingRequest(this)
  let template = pug.compile(source, {
    filename: this.resourcePath,
    self: query.self,
    pretty: query.pretty,
    locals: query.locals,
    doctype: query.doctype || 'js',
    compileDebug: this.debug || false
  })
  let content = JSON.stringify(template(query))
  return `module.exports = ${content};`
}
