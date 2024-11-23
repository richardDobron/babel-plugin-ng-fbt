# babel-plugin-ng-fbt ![](https://github.com/richardDobron/babel-plugin-ng-fbt/workflows/tests/badge.svg) [![npm](https://img.shields.io/npm/v/babel-plugin-ng-fbt.svg)](https://www.npmjs.com/package/babel-plugin-ng-fbt)

The FBT Babel localization transform for AngularJS.

## Installation

```
$ npm install babel-plugin-ng-fbt
```

## ngx-build-plus integration


1. In package.json

```diff
 "scripts": {
+  "postinstall": "patch-package"
 }
```

3. Create a file named `patches/babel-plugin-fbt+1.0.0.patch` in the root of your project using the content from this [link](https://github.com/richardDobron/babel-plugin-ng-fbt/patches/babel-plugin-fbt+1.0.0.patch).

4. Install patch-package

```
$ npm install patch-package
```

5. Create file named `.babelrc` in the root of your project and add the following content:

```json
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-typescript"
    ],
    "plugins": [
        [
            "@babel/plugin-proposal-decorators",
            {
                "legacy": true
            }
        ],
        "@babel/plugin-proposal-class-properties"
    ]
}
```

6. Create file named `fbt.plugin.js` in the root of your project and add the following content:

```javascript
const path = require('path');

exports.default = {
    config(cfg) {
        cfg.module.rules = [
            {
                test: /\.[jt]s$/,
                exclude: /[\\/]node_modules[\\/](?!(incompatible-module1|incompatible_module_2)[\\/])/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: true,
                        plugins: [
                            'babel-plugin-ng-fbt', // this line must be added before 'babel-plugin-fbt'
                            [
                                'babel-plugin-fbt',
                                {
                                    fbtEnumPath: path.join(__dirname, '.enum_manifest.json'),
                                },
                            ],
                            'babel-plugin-fbt-runtime',
                        ],
                    },
                },
            },
            ...cfg.module.rules,
        ];

        return cfg;
    },
};
```

7. Add the following lines to your `angular.json` file:

```diff
{
  "projects": {
    "your-project-name": {
      "architect": {
        "build": {
          "builder": "ngx-build-plus:browser",
          "options": {
+             "plugin": "~fbt.plugin.js"
          }
        }
      }
    }
  }
}
```

## Angular implementation concept

```typescript
import { Component } from '@angular/core';
import fbt from 'fbt';

@Component({
  selector: 'store-button',
  standalone: true,
  template: `<button type="submit">
    {{ fbt('Save', 'Button: Save a form or settings') }}
  </button>`,
})
export class StoreButtonComponent {
  protected readonly fbt = fbt;
}
```

## License

This plugin is licensed under the MIT license. See [LICENSE](./LICENSE).