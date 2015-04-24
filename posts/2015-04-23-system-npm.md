{
  "title": "Using NPM with SystemJS",
  "date": "2015-04-23",
  "categories": "steal stealjs systemjs"
}

[system-npm](https://github.com/stealjs/system-npm) is an amazing plugin for SystemJS that enables you to load your NPM dependencies with zero configuration.  Just load system-npm and then load your project; require your NPM dependencies just as if you were in Node.

To use system-npm with SystemJS you'll first want to install SystemJS into your project.  In this post we're assuming you've included `system.js` and `es6-module-loader.js` in a `vendor/` folder, but you can place it where-ever you want. Then simply add a script tag to your page to load SystemJS:

```
<script src="vendor/system.js"></script>
```

## Installing

**system-npm** is installed through NPM (of course!):

```
npm install system-npm --save-dev
```

## Configuring

Next you'll want to configure SystemJS to know where to load the plugin. Create a `config.js` file and add the appropriate config:

```
System.config({
	map: {
		"npm": "system-npm",
		"npm-extension": "system-npm/npm-extension"
	},
	paths: {
		"system-npm/*": "node_modules/system-npm/*.js"
	}
});
```

This tells SystemJS how to load system-npm. Add the configuration script to your page after SystemJS:

```
<script src="config.js"></script>
```

## Load your app

Now that it is configured you can load your `package.json` using the plugin and then start up your applicaiton:

```
<script>
	System.import("package.json!npm").then(function(){
		System.import("app/app");
	});
</script>
```

## Develop

From here you can develop as you wish, sharing the same dependencies between Node and the Browser. **system-npm** will load your package.json and use the metadata. If you want to limit it to only loading your client-side deps, you can specify this in your configuration:

```
System.config({
  npmDependencies: [
    "jquery",
    "backbone"
  ]
});
```

Doing this, system-npm will only load *jquery* and *backbone* as dependencies.

It's that simple. system-npm is a great way to instantly make your SystemJS projects nearly configuration-free.
