#!/bin/sh
cd `git rev-parse --show-toplevel`

rm -rf build

emcmake cmake -S . -B build -G \"Unix Makefiles\" -DENABLE_EMSCRIPTEN=on -DENABLE_SHARED=off -DENABLE_CAPI=off -DENABLE_TESTS=off -DENABLE_ELEMENTS=on -DGENERATE_WALLY=on -DENABLE_JS_WRAPPER=off -DCMAKE_BUILD_TYPE=Release
if [ $? -gt 0 ]; then
  exit 1
fi

cmake --build build --parallel 2 --config Release
if [ $? -gt 0 ]; then
  exit 1
fi

cp build/Release/cfdjs_wasm.* dist/
