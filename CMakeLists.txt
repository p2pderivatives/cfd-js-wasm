cmake_minimum_required(VERSION 3.13)

# configure.ac: AC_INIT([cfd-js], [1.0]
set(PACKAGE_VERSION_p2pderivatives   0.1.0)

####################
# options
####################
include(./cmake/CfdCommonOption.cmake)
include(./cmake/CfdWallyOption.cmake)

option(ENABLE_CAPI  "enable c-api (ON or OFF. default:OFF)" OFF)

if(NOT APPLE)
set(ENABLE_SHARED ON CACHE BOOL "" FORCE)
endif()

set(ENABLE_EMSCRIPTEN ON CACHE BOOL "" FORCE)

####################
# common setting
####################
include(./cmake/CfdCommonSetting.cmake)
include(./cmake/ConvertSrclistFunction.cmake)

####################
# subdirectories
####################
project(cfdjs_wasm_all CXX)

if(ENABLE_EMSCRIPTEN)
add_subdirectory(external)
add_subdirectory(src)
endif()
