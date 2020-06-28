# Crypto Finance Development Kit for WebAssembly (CFD-JS-WASM)

WebAssembly of cfd libraries (by JSON format API)

## WebAssembly Example

- [example](./example/index.html)

<!-- TODO: Write Summary and Overview

## Overview

-->

## Dependencies

- C/C++ Compiler
  - can compile c++11
- Clang (10.0.0 or higher)
- CMake (3.14.3 or higher)
- Python 3.x
- node.js (stable version)
- emscripten (1.39.10 or higher)

---

## Use case

### add dependencies on package.json

Add cfd-js-wasm github on caller app's package.json.

ex)
```
  "cfd-js-wasm": "github:cryptogarageinc/cfd-js-wasm#semver:^0.1.0",
```

If you use old npm or yarn, describe as follows.

ex)
```
  "cfd-js": "git+https://github.com/cryptogarageinc/cfd-js-wasm#semver:^0.1.0",
```

### copy direct file

Copy the wasm file in the build/Release folder.


For access to wasm, copy'cfdjs_wasm_json.js' or make your own.

---

## for Developper

### Build

#### Using docker

WebAssembly does not depend on the execution environment.
You can use it in any environment by building it on Docker.

```
docker run .
```

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

```
npm run example
```

#### Elements

```
npm run elements_example
```

## Note

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

### For installed fail:

If the shared library you downloaded cannot be referenced and the build fails, do a full build without downloading the shared library.
Prevents the download of the shared library by setting `CFDJS_UNUSE_ASSET=1` in the environment variable.

- Windows: (On the command line. Or set from the system setting screen.)
```
set CFDJS_UNUSE_ASSET=1
```

- MacOS & Linux(Ubuntu):
```
export CFDJS_UNUSE_ASSET=1
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
