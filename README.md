
# Motivation

This project was written so that TRIK programming could be less of a pain. It does so by providing JS api's and syntactic features that are missing in QtScript using [core-js](https://github.com/zloirock/core-js) and [babel](https://babeljs.io/) along with static typing using [TypeScript](https://www.typescriptlang.org/). This allows to use not-so-ugly classes, iterators, generators and so on.

Also this project can be used for programming of TRIKs without trik-studio. This is achieved by using `remote-run.py` script that allows to upload, run and get output of your program. But no simulator integration is implemented yet.

# Description of build system

In order to accomplish this goal, a compilation process must be organized. [rollup](https://rollupjs.org/) is used for this. Simply speaking, it takes a bunch of `.ts` files and generates one `.js` bundle that has all the functionality combined.

This setup is more-or-less generic rollup-typescript-babel setup (like [this one](https://github.com/a-tarasyuk/rollup-typescript-babel)), with some notable additions:

- TRIK APIs are defined as external modules for rollup (they have to be imported in order to be used). TypeScript type definitions are provided (See [TRIK modules and typedefs](#trik-modules-and-typedefs))
- Multiple entry points are supported. This allows to share code between different scripts sent to TRIK (see [Entry Points](#entry-points))
- A set [polyfills](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill) is imported by entry point automatically (this is achieved using [rollup-plugin-polyfill](https://github.com/JRJurman/rollup-plugin-polyfill) and [rollup-plugin-root-import](https://github.com/mixmaxhq/rollup-plugin-root-import) (see [Polyfills](#polyfills))
- Entry points that are to be executed on real robot are appended with a special end-of-script marker (see [remote-run.py and End-Of-Script marker](#remote-runpy-and-end-of-script-marker))

## TRIK modules and typedefs

Conventional TRIK scripting uses various global variables to interact with APIs. To support type definitions they are provided as modules instead. `brick` corresponds to `trik_brick`, `script` corresponds to `trik_script`, `mailbox` corresponds to `trik_mailbox` and `Threading` corresponds to `trik_threading`.

All of those modules are have (partial) type definitions, located in `src/lib_defs/trik.d.ts`. They are based on `trikRuntime` source code ([brickInterface.h](https://github.com/trikset/trikRuntime/blob/master/trikControl/include/trikControl/brickInterface.h), [ScriptExecutionControl.h](https://github.com/trikset/trikRuntime/blob/master/trikScriptRunner/src/scriptExecutionControl.h), [mailbox.h](https://github.com/trikset/trikRuntime/blob/master/trikNetwork/src/mailbox.h) and [threading.h](https://github.com/trikset/trikRuntime/blob/master/trikScriptRunner/src/threading.h))

## Entry points

Entry point should be located in `src/entry_points` or any subdirectory. Each entry point will result in generation of separate, fully-independent bundle that can be executed on TRIK.

Entry points are divided into two types: those that execute on real robot and those that are designed for simulator. This is shown by putting either `real` or `sim` to the file name.

Resulting bundles will be placed into `bin/real` and `bin/sim`.

## Polyfills

[Polyfills](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill) used on TRIK are located in `src/polyfills` directory. `index.js` imports all other files (it is implicitly added as an import to every entry point compiled). `global.js` defines variable `global` (QtScript does not have it). `unsystem.js` removes unneccessary variables added by TRIK's [system.js](https://github.com/trikset/trikRuntime/blob/master/trikScriptRunner/system.js) from global namespace. `trik_shim.js` imports various [core-js](https://github.com/zloirock/core-js) modules that provide runtime support for missing APIs. Some of the APIs are not imported, but implemented there using TRIK's non-standard APIs.


## remote-run.py and End-Of-Script marker

`remote-run.py` implements the protocol used by trik studio for uploading and running of programs. But the problem is that it has no means of knowing when your script is done executing (without errors). This is achieved by adding end-of-script markers to each real robot entry point. It's a piece of code that prints a pre-defined value (`__eb3caide9Oojaiku__stop_marker__`) to the console. When `remote-run.py` encounters it, it assumes that script is done executing and exits.

Placement of such a marker is achieved by a (small) rollup plugin: `rollup-plugin-real-transform.js`.

Also `remote-run.py` has ability to work with several robots. This is done by introducing a `ADDRESSES` constant, defining all the addresses that are to be used. An index in that array could later be provided to the script as a second (optional) parameter.

# Usage

Quick start guide would be:

1. Install `npm`
2. Clone the repo (`git clone https://github.com/DCNick3/trik-typescript-template.git`)
3. Install required npm packages (`npm install`, executed in the repo directory)
4. Build the code (`npm run build`)

To upload some code to the robot run `npm run run`

Target file and robot index can be changed in `package.json`

# Code examples

This repo contains sample code that demonstrates some of the features of the build system. See `src/implementation/index.ts` for actual code and `src/entry_points` for entry points.

