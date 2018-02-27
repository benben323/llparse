'use strict';
/* global describe it beforeEach */

const llparse = require('../');

const fixtures = require('./fixtures');

describe('LLParse/resumption', function() {
  this.timeout(fixtures.TIMEOUT);

  let p;
  beforeEach(() => {
    p = llparse.create('llparse');
  });

  it('should resume after span end pause', (callback) => {
    const start = p.node('start');
    const a = p.node('a');
    const span = p.span(p.code.span('llparse__pause_once'));

    start
      .peek('a', span.start(a))
      .skipTo(start);

    a
      .match('a', a)
      .otherwise(span.end(start));

    const binary = fixtures.build(p, start, 'resume-span');

    binary('baaab',
      new RegExp(
        '^('+
          'off=\\d+ pause\\noff=1 len=3 span\\[pause\\]="aaa"' +
          '|' +
          'off=1 len=3 span\\[pause\\]="aaa"\noff=4 pause' +
          ')\\n$'
        , 'g'),
      callback);
  });
});
