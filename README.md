# Crypto Finance Development Kit for WebAssembly (CFD-JS-WASM)

WebAssembly of cfd libraries (by JSON format API)

## WebAssembly Example

- [example](https://p2pderivatives.github.io/cfd-js-wasm/example/index.html)

<!-- TODO: Write Summary and Overview

## Overview

-->

---

## Use case

### use web page development

Copy the wasm file in the dist folder. For access to wasm, copy'cfdjs_wasm_json.js' or make your own.
Copy cfdjs_wasm_jsonapi.js if necessary.

### add dependencies on package.json (node.js or electron)

Add github's cfd-js-wasm path on caller app's package.json:
```
  "cfd-js-wasm": "github:p2pderivatives/cfd-js-wasm#semver:^0.1.0",
```

If you use old npm or yarn, describe as follows:
```
  "cfd-js-wasm": "git+https://github.com/p2pderivatives/cfd-js-wasm#semver:^0.1.0",
```

---

## for Developper

### Dependencies

- Clang (10.0.0 or higher)
- C/C++ Compiler
  - can compile c++11
- CMake (3.14.3 or higher)
- Python (3.8 or higher)
- node.js (12.8 or higher)
- emscripten (1.39.10 or higher)

### Build

#### Using docker

WebAssembly does not depend on the execution environment.
You can use it in any environment by building it on Docker.

```
docker-compose build
docker-compose up
```

- attention
  If you get an error, do the following:
  1. remove external/libwally-core
  2. remove node_modules

#### local build

First, set the environment variable of emscripten according to the usage procedure of emscripten.

When using the cmake-js package and npm script, the options for compilation are already set.

```Shell
npm install
npm run emcmake
```

### Test

```Shell
npm run test
```

### Example

#### web Example

Show [github pages](https://p2pderivatives.github.io/cfd-js-wasm/example/index.html).

#### node.js Example

```
npm run example
npm run elements_example
npm run ts_example
```

---

## Information for developpers

### using library

- cfd-js

### formatter

- clang-format (using v10.0.0)
- eslint

### linter

- cpplint
- eslint

### document tool

- doxygen & graphviz

---

## Developper Note

### Git connection:

Git repository connections default to HTTPS.
However, depending on the connection settings of GitHub, you may only be able to connect via SSH.
As a countermeasure, forcibly establish SSH connection by setting `CFD_CMAKE_GIT_SSH=1` in the environment variable.

- Windows: (On the command line. Or set from the system setting screen.)
```
set CFD_CMAKE_GIT_SSH=1
```

- MacOS & Linux(Ubuntu):
```
export CFD_CMAKE_GIT_SSH=1
```

### Ignore git update for CMake External Project:

Depending on your git environment, you may get the following error when checking out external:
```
  Performing update step for 'libwally-core-download'
  Current branch cmake_build is up to date.
  No stash entries found.
  No stash entries found.
  No stash entries found.
  CMake Error at /workspace/cfd-core/build/external/libwally-core/download/libwally-core-download-prefix/tmp/libwally-core-download-gitupdate.cmake:133 (message):


    Failed to unstash changes in:
    '/workspace/cfd-core/external/libwally-core/'.

    You will have to resolve the conflicts manually
```

This phenomenon is due to the `git update` related command.
Please set an environment variable that skips update processing.

- Windows: (On the command line. Or set from the system setting screen.)
```
set CFD_CMAKE_GIT_SKIP_UPDATE=1
```

- MacOS & Linux(Ubuntu):
```
export CFD_CMAKE_GIT_SKIP_UPDATE=1
```
