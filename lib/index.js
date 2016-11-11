/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Williams Medina @willyelm
*/
'use strict'
const util = require('loader-utils');
const path = require('path');
const pug = require('pug');

module.exports = function (source) {

  const applySubstitutionRules = (data) => {
    for (var key in data) {
      if (typeof data[key] === 'string') {
        data[key] = data[key]
          .replace('[templatename]', path.basename(this.resourcePath, '.pug'))
          .replace('[templatepath]', this.resourcePath)
      } else if (Object.keys(data[key]).length > 0) {
        data[key] = applySubstitutionRules(data[key]);
      }
    }

    return data;
  };

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


  data = applySubstitutionRules(data);

  let html = template(data)
  if (query.exports === false) {
    return html
  } else {
    let content = JSON.stringify(html)
    return `module.exports = ${content};`
  }
}
