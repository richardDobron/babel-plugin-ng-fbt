const t = require("@babel/types");
const { transform } = require("@babel/core");
const { parse } = require("@babel/parser");
const { expect } = require("chai");
const plugin = require("../index.js");

function replace(input, options = {}) {
  return transform(input, {
    babelrc: false,
    configFile: false,
    plugins: [[plugin, options]],
  }).code;
}

function compare(input, output, options = {}) {
  const transformed = replace(input, options);

  if (!t.isNodesEquivalent(parse(transformed), parse(output))) {
    expect(transformed).to.equal(output);
  }
}

describe("babel-plugin-ng-fbt", () => {
  describe("for object member access", () => {
    it("remove ctx prefix from nested fbs", () => {
      compare(
        "ctx.fbt('with token ' + ctx.fbt.param('token', 'A') + ' here', 'test')",
        "fbt('with token ' + fbt.param('token', 'A') + ' here', 'test')"
      );
    });

    it("keep custom prefix from nested fbs", () => {
      compare(
        "obj.fbt('with token ' + obj.fbt.param('token', 'A') + ' here', 'test')",
        "obj.fbt('with token ' + obj.fbt.param('token', 'A') + ' here', 'test')"
      );
    });

    it("keep fbt as is", () => {
      compare("fbt('without tokens', 'test')", "fbt('without tokens', 'test')");
    });

    it("remove ctx prefix from fbs", () => {
      compare(
        "(true) ? ctx.fbt('Yes', 'simple answer') : ctx.fbt('No', 'simple answer')",
        "true ? fbt('Yes', 'simple answer') : fbt('No', 'simple answer')"
      );
    });

    it("remove context identifier from multiline fbs", () => {
      compare(
        "ctx.fbs(\n" +
          "  [\n" +
          "    'I have ',\n" +
          "    ctx.fbs.plural('a dream', count, {\n" +
          "      many: 'dreams',\n" +
          "      showCount: 'yes',\n" +
          "      value: ctx.fbs('three', 'custom UI value'),\n" +
          "    }),\n" +
          "    '.',\n" +
          "  ],\n" +
          "  'desc',\n" +
          ")",
        "fbs(\n" +
          "  [\n" +
          "    'I have ',\n" +
          "    fbs.plural('a dream', count, {\n" +
          "      many: 'dreams',\n" +
          "      showCount: 'yes',\n" +
          "      value: fbs('three', 'custom UI value'),\n" +
          "    }),\n" +
          "    '.',\n" +
          "  ],\n" +
          "  'desc',\n" +
          ")"
      );
    });
  });
});
