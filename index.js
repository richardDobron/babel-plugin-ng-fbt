module.exports = function (babel) {
  const { types: t } = babel;

  function isFbtModuleOrMethod(object, property) {
    return (
      t.isIdentifier(object, { name: "ctx" }) &&
      (t.isIdentifier(property, { name: "fbt" }) ||
        t.isIdentifier(property, { name: "fbs" }))
    );
  }

  return {
    visitor: {
      // Transform `ctx.fbt` or `ctx.fbt.<sub-method>` with `fbt` or `fbt.<sub-method>`
      CallExpression(path) {
        const { scope, node } = path;
        const { callee } = node;
        const { object, property } = callee;

        if (t.isMemberExpression(callee) && isFbtModuleOrMethod(object, property)) {
          node.callee = t.identifier(property.name);

          scope.traverse(node, {
            MemberExpression(path) {
              const { object, property } = path.node;

              if (isFbtModuleOrMethod(object, property)) {
                path.replaceWith(t.identifier(property.name));
              }
            },
          });
        }
      },
    },
  };
};
