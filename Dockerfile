FROM ghcr.io/cryptogarageinc/elements-testing:v0.1.0 as cfd_wasm_base

ARG EMSDK_VERSION=2.0.12
ARG NODE_VERSION=14.15.5

# install tzdata before git
RUN apt-get update && apt-get install -y tzdata
ENV TZ=Asia/Tokyo

RUN apt-get update && apt-get install -y \
    csh \
    clang \
    clang-format \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir /emscripten && chmod 777 /emscripten && \
    n $NODE_VERSION

WORKDIR /emscripten

RUN git clone https://github.com/emscripten-core/emsdk.git && \
    cd /emscripten/emsdk && \
    ./emsdk install $EMSDK_VERSION && \
    ./emsdk activate $EMSDK_VERSION

FROM cfd_wasm_base as cfd_wasm_builder

ENV PATH /usr/local/bin:/emscripten/emsdk:/emscripten/emsdk/upstream/emscripten:/emscripten/emsdk/node/$NODE_VERSION_64bit/bin:$PATH
ENV EMSDK /emscripten/emsdk
ENV EM_CONFIG /emscripten/emsdk/.emscripten
ENV EM_CACHE /emscripten/emsdk/upstream/emscripten/cache
ENV EMSDK_NODE /emscripten/emsdk/node/$NODE_VERSION_64bit/bin/node

WORKDIR /emscripten

RUN chmod 755 /emscripten/emsdk/emsdk_env.sh && \
    chmod 755 /emscripten/emsdk && \
    node --version && cmake --version && clang --version && em++ --version && env

# RUN /emscripten/emsdk/emsdk_env.sh

ENTRYPOINT ["/bin/bash", "-l", "-c"]