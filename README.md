# babel-plugin-ng-fbt ![](https://github.com/richardDobron/babel-plugin-ng-fbt/workflows/tests/badge.svg) [![npm](https://img.shields.io/npm/v/babel-plugin-ng-fbt.svg)](https://www.npmjs.com/package/babel-plugin-ng-fbt)

The FBT Babel localization transform for AngularJS.

## 📦 Installation

Install the plugin via npm:

```
npm install babel-plugin-ng-fbt
```

## 📖 ngx-build-plus integration


1. Modify package.json

```diff
 "scripts": {
+  "postinstall": "patch-package"
 }
```

2. Create Patch File

Create a file named `patches/babel-plugin-fbt+1.0.0.patch` in the root of your project using the content from this patch file:

   <https://github.com/richardDobron/babel-plugin-ng-fbt/blob/99c9ab6d7d0aee824ee1d652e09b0b82e52db4e7/patches/babel-plugin-fbt%2B1.0.0.patch#L1-L42>

3. Install patch-package

```
npm install patch-package
```

4. Create .babelrc File

Add the following configuration to `.babelrc` in the root of your project:

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

5. Create fbt.plugin.js File

Add the following content to `fbt.plugin.js` in the root of your project:

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

6. Modify angular.json

Add the following configuration to your `angular.json` file:

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

## ⚡️ Angular implementation concept

Below is an example of how to integrate `babel-plugin-ng-fbt` into an Angular component:

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

## ⚖️ License

This plugin is licensed under the MIT license. See [LICENSE](./LICENSE).