+++
categories = "steal stealjs modules"
date = "2015-03-31T00:00:00.000Z"
title = "Organizing your library project with StealJS"

+++


With [StealJS](http://stealjs.com/) you can easily set up an open-source library that fits with the way you like to organize your code. A common directory structure might look like this:


    - src
      - main.js
      - dep.js
    - test
      - test.html
      - test.js
    package.json
    Gruntfile.js

In order to keep a shallow folder structure we've divided the library's source code in `src` and its tests in `test`. The root directory only contains our `package.json` and a `Gruntfile.js` for builds.

With this structure you might try to install your module with NPM:

```shell
npm install my-module --save
```

And then load it in your project:

```js
import myModule from "my-module";
```

However this will fail because your `main` is not pointing to right place. Imagine your `main.js` look like:

```js
import dep from "my-module/dep";
```

Steal will look for `dep.js` in the project's root folder. To set an alternative root, correctly called the lib folder, set it in the `package.json`:

```json
{
  "name": "my-module",
  "main": "dist/cjs/main.js",
  "system": {
    "main": "main",
    "directories": {
      "lib": "src"
    }
  }
}
```

This tells Steal that your library's code is nested under the `src` folder. This makes it easy to refer to your module by name in its internal code. With your test do the same thing:

```js
import myModuleDep from "my-module/dep";
```

Will correctly load `src/dep.js` if that's the module you want to test.

## Building

If you're only target Steal you can go ahead and publish your module on NPM. But if you want to reach users of other module loaders you should set up a build script. [steal-tools](http://stealjs.com/docs/steal-tools.html) makes this easy. For example if using Grunt:

```js
grunt.initConfig({
  "steal-export": {
    dist: {
      system: {
        config: "package.json!npm"
      },
      outputs: {
        "+cjs": {},
        "+amd": {},
        "global-js": {]
      }
    }
  }
});
```

Then by simply running `grunt steal-export` will produce `dist/cjs`, `dist/amd`, and `dist/global` folders containing code that will run in RequireJS, Browserify, and as a browser global. Read [the full guide](http://stealjs.com/docs/StealJS.project-exporting.html) on setting up an export for your project for more.

See [bit-tabs](https://github.com/bitovi-components/bit-tabs) for a full example of this directory structure in action.
