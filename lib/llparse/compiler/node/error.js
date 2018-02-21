'use strict';

const node = require('./');

class Error extends node.Node {
  constructor(name, code, reason) {
    super('error', name);

    this.code = code;
    this.reason = reason;
  }

  prologue(ctx, body) {
    return body;
  }

  doBuild(ctx, body) {
    body.comment('node.Error');

    const INT = ctx.INT;

    const reason = ctx.ir.cstr(this.reason);

    const codePtr = ctx.field('error');
    body.push(codePtr);

    const reasonPtr = ctx.field('reason');
    body.push(reasonPtr);

    const cast = ctx.ir._('getelementptr inbounds', reason.type.to,
      [ reason.type, reason ], [ INT, INT.v(0) ], [ INT, INT.v(0) ]);
    body.push(cast);

    body.push(ctx.ir._('store', [ ctx.TYPE_ERROR, ctx.TYPE_ERROR.v(this.code) ],
      [ ctx.TYPE_ERROR.ptr(), codePtr ]).void());
    body.push(ctx.ir._('store', [ ctx.TYPE_REASON, cast ],
      [ ctx.TYPE_REASON.ptr(), reasonPtr ]).void());

    const retType = ctx.fn.type.ret;
    body.terminate('ret', [ retType, retType.v(null) ]);
  }
}
module.exports = Error;