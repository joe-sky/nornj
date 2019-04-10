# TypeScript NornJ Plugin

TypeScript server plugin that adds intellisense for [NornJ template engine](https://github.com/joe-sky/nornj)

This is a fork of [typescript-lit-html-plugin](https://github.com/Microsoft/typescript-lit-html-plugin).

**Features**

- IntelliSense for html tags and attributes.
- Quick info hovers on tags.
- Formatting support.
- Auto closing tags.
- Folding html.
- CSS completions in style blocks.
- Works with literal html strings that contain placeholders.

## Usage
This plugin requires TypeScript 2.4 or later. It can provide intellisense in both JavaScript and TypeScript files within any editor that uses TypeScript to power their language features. The simplest way to use this plugin is through the [nornj-highlight](https://marketplace.visualstudio.com/itemdetails?itemName=joe-sky.nornj) extension. This extension automatically enables the plugin, and also adds syntax highlighting for nornj and synchronization of settings between VS Code and the plugin.

To use a specific version of this plugin with VS Code, first install the plugin and a copy of TypeScript in your workspace:

```bash
npm install --save-dev typescript-nornj-plugin typescript
```

Then add a `plugins` section to your [`tsconfig.json`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html) or [`jsconfig.json`](https://code.visualstudio.com/Docs/languages/javascript#_javascript-project-jsconfigjson)

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-nornj-plugin"
      }
    ]
  }
}
```

Finally, run the `Select TypeScript version` command in VS Code to switch to use the workspace version of TypeScript for VS Code's JavaScript and TypeScript language support. You can find more information about managing typescript versions [in the VS Code documentation](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions).


## Configuration

You can configure the behavior of this plugin in `plugins` section of in your `tsconfig` or `jsconfig`.

If you are using [nornj-highlight](https://marketplace.visualstudio.com/itemdetails?itemName=joe-sky.nornj) extension for VS Code, you can configure these settings in the editor settings instead of using a `tsconfig` or `jsconfig`.

### Tags
This plugin adds html IntelliSense to any template literal [tagged](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) with `nj`:

```js
import nj from 'nornj';

nj`
    <div></div>
`
```

You can enable IntelliSense for other tag names by configuring `"tags"`:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-nornj-plugin",
        "tags": [
          "html",
          "template"
        ]
      }
    ]
  }
}
```


### Formatting
The plugin formats html code by default. You can disable this by setting `"format.enabled": false`

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-nornj-plugin",
        "format": { "enabled": false }
      }
    ]
  }
}
```

### Testing
Run the test using the `e2e` script:

```bash
(cd e2e && npm install)
npm run e2e
```

The repo also includes a vscode `launch.json` that you can use to debug the tests and the server. The `Mocha Tests` launch configuration starts the unit tests. Once a test is running and the TypeScript server for it has been started, use the `Attach To TS Server` launch configuration to debug the plugin itself. 