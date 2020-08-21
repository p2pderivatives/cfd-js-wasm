#!/bin/sh

if [ -n "$WASM_SRC" ]; then
BASEDIR=$WASM_SRC
else
BASEDIR=`git rev-parse --show-toplevel`
fi

if [ -z "$BASEDIR" ]; then
exit 1
fi

cd $BASEDIR

if [ -n "$WASM_WORK" ]; then
WORKDIR=$WASM_WORK
else
WORKDIR=temp
fi

echo "BASEDIR=$BASEDIR"
echo "WORKDIR=$WORKDIR"

if [ -z "$WORKDIR" ]; then
exit 1
fi

rm -rf $WORKDIR/*
mkdir $WORKDIR
mkdir $WORKDIR/external
mkdir $WORKDIR/dist

cp CMakeLists.txt $WORKDIR/
cp *.json $WORKDIR/
cp *.js $WORKDIR/
cp *.ts $WORKDIR/
cp -rp cmake $WORKDIR/cmake
cp -rp external/CMakeLists.txt $WORKDIR/external
cp -rp external/template_CMakeLists.txt.in $WORKDIR/external
cp -rp local_resource $WORKDIR/local_resource
cp -rp src $WORKDIR/src
cp -rp tools $WORKDIR/tools
cp -rp wrap_js $WORKDIR/wrap_js

cd $WORKDIR
if [ $? -gt 0 ]; then
  echo "change directory NG."
  exit 1
fi

echo "configure start."

emcmake cmake -S . -B build -G "Unix Makefiles" -DENABLE_EMSCRIPTEN=on -DENABLE_SHARED=off -DENABLE_CAPI=off -DENABLE_TESTS=off -DENABLE_ELEMENTS=on -DGENERATE_WALLY=on -DENABLE_JS_WRAPPER=off -DCMAKE_BUILD_TYPE=Release
if [ $? -gt 0 ]; then
  echo "cmake configure NG."
  exit 1
fi

cmake --build build --parallel 2 --config Release
if [ $? -gt 0 ]; then
  echo "cmake build NG."
  exit 1
fi

cp ./build/Release/cfdjs_wasm.* $BASEDIR/dist/

npm install
npm run convert_json
cp ./index.d.ts $BASEDIR/index.d.ts
