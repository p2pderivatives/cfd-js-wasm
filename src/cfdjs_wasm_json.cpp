// Copyright 2020 CryptoGarage
/**
 * @file cfdjs_wasm_json.cpp
 *
 * @brief cfd WebAssembly API implements file.
 */
#include <emscripten.h>  // NOLINT
#include <string.h>      // NOLINT

#include <exception>
#include <functional>
#include <iostream>
#include <map>
#include <string>

#include "cfd/cfd_common.h"
#include "cfdcore/cfdcore_exception.h"
#include "cfdjs/cfdjs_api_json.h"

using cfd::core::CfdException;
using cfd::js::api::json::JsonMappingApi;
using cfd::js::api::json::RequestFunctionMap;
using cfd::js::api::json::ResponseOnlyFunctionMap;

// -----------------------------------------------------------------------------
// API wrapper for node addon
// -----------------------------------------------------------------------------
/// global error prefix.
constexpr const char* const g_error_prefix = "Error: ";
/// global cfd-error prefix.
constexpr const char* const g_cfderror_prefix = "CfdError: ";

namespace cfd {
namespace js {
namespace api {
namespace json {

/// callback function map.
static std::map<std::string, std::function<std::string(const std::string&)>>
    g_callback_map;
/// no-input callback function map.
static std::map<std::string, std::function<std::string()>> g_response_map;

/**
 * @brief initialize API.
 */
void InitializeMap() {
  if (!g_response_map.empty()) return;

  JsonMappingApi::LoadFunctions(&g_callback_map, &g_response_map);
}

/**
 * @brief create string buffer.
 * @param[in] message   message string.
 * @return string buffer.
 */
char* CreateString(const std::string& message) {
  size_t len = message.length();
  char* addr = static_cast<char*>(::malloc(len + 1));
  if (addr == nullptr) {
    // warn(CFD_LOG_SOURCE, "malloc NG.");
    return nullptr;
  }
  ::memset(addr, 0, len + 1);
  message.copy(addr, len);
  // std::cout << "malloc addr:" << std::hex << (void*)addr << std::endl;
  return addr;
}

/**
 * @brief call json api.
 * @param[in] command   request api.
 * @param[in] param     request json message.
 * @return response json message.
 */
std::string CallJsonApi(const std::string& command, const std::string& param) {
  static std::string cfderror_prefix(g_cfderror_prefix);
  static std::string error_prefix(g_error_prefix);
  // using cfd::js::api::json::g_callback_map;
  // using cfd::js::api::json::g_response_map;
  std::string result;
  try {
    cfd::js::api::json::InitializeMap();
    // std::cout << "CallJsonApi command:" << command << std::endl;
    // std::cout << "CallJsonApi param:" << param << std::endl;
    if (g_response_map.count(command) > 0) {
      return g_response_map[command]();
    } else if (g_callback_map.count(command) > 0) {
      if (!param.empty()) {
        return g_callback_map[command](param);
      }
    } else {
      return error_prefix + "[" + command + "] is unknown command.";
    }
    return error_prefix + "Invalid parameter.";
  } catch (const CfdException& except) {
    // std::cout << "CfdException:" << except.what() << std::endl;
    return cfderror_prefix + std::string(except.what());
  } catch (const std::exception& std_except) {
    // std::cout << "exception:" << std_except.what() << std::endl;
    return error_prefix + std::string(std_except.what());
  } catch (...) {
    // std::cout << "Unknown Error" << std::endl;
    return error_prefix + "Unknown Error:";
  }
}

/**
 * @brief get json api name list.
 * @return a list of json api names separated by commas.
 */
std::string GetJsonApiNames() {
  static std::string cfderror_prefix(g_cfderror_prefix);
  static std::string error_prefix(g_error_prefix);
  std::string result;
  try {
    cfd::js::api::json::InitializeMap();

    auto ite = g_response_map.cbegin();
    if (ite != g_response_map.cend()) {
      result = (*ite).first;
      ++ite;
    }
    while (ite != g_response_map.cend()) {
      result += ',' + (*ite).first;
      ++ite;
    }
    for (auto it = g_callback_map.cbegin(); it != g_callback_map.cend(); ++it)
      result += ',' + (*it).first;

    return result;
  } catch (const CfdException& except) {
    // std::cout << "CfdException:" << except.what() << std::endl;
    return cfderror_prefix + std::string(except.what());
  } catch (const std::exception& std_except) {
    // std::cout << "exception:" << std_except.what() << std::endl;
    return error_prefix + std::string(std_except.what());
  } catch (...) {
    // std::cout << "Unknown Error" << std::endl;
    return error_prefix + "Unknown Error:";
  }
}

}  // namespace json
}  // namespace api
}  // namespace js
}  // namespace cfd

/**
 * @brief free string buffer.
 * @param[in] str   string buffer.
 */
EMSCRIPTEN_KEEPALIVE extern "C" void cfdjsFreeString(char* str) {
  if (str != nullptr) {
    // std::cout << "free addr:" << std::hex << (void*)str << std::endl;
    free(str);
  }
}

/**
 * @brief request json api.
 * @param[in] command   request api.
 * @param[in] param     request json message.
 * @return response json message. 
 *   Call 'cfdjs_free_string' after you are finished using it.
 */
EMSCRIPTEN_KEEPALIVE extern "C" char* cfdjsJsonApi(
    const char* command, const char* param) {
  using cfd::js::api::json::CallJsonApi;
  using cfd::js::api::json::CreateString;
  std::string cmd;
  std::string arg;
  if (command != nullptr) cmd = std::string(command);
  if (param != nullptr) arg = std::string(param);

  std::string result = CallJsonApi(cmd, arg);
  return CreateString(result);
}

/**
 * @brief get json api name list.
 * @return a list of json api names separated by commas.
 *   Call 'cfdjs_free_string' after you are finished using it.
 */
EMSCRIPTEN_KEEPALIVE extern "C" char* cfdjsGetJsonApiNames() {
  using cfd::js::api::json::CreateString;
  using cfd::js::api::json::GetJsonApiNames;

  std::string result = GetJsonApiNames();
  return CreateString(result);
}
