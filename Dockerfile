FROM ubuntu:20.04 as cfdWasmBase

ARG EMSDK_VERSION=1.39.18
ARG NODE_VERSION=12.18.1

RUN apt-get update && apt-get install -y tzdata
ENV TZ=Asia/Tokyo

RUN apt-get install -y \
    gpg \
    wget \
    csh \
    cmake \
    clang \
    clang-format \
    python \
    nodejs \
    npm \
    git \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /root
RUN npm install -g npm n && \
    n $NODE_VERSION

RUN git clone https://github.com/emscripten-core/emsdk.git && \
    cd /root/emsdk && \
    ./emsdk install $EMSDK_VERSION && \
    ./emsdk activate $EMSDK_VERSION

FROM cfdWasmBase as cfdWasmBuilder

ENV PATH /usr/local/bin:/root/emsdk:/root/emsdk/upstream/emscripten:/root/emsdk/node/12.18.1_64bit/bin:$PATH
ENV EMSDK /root/emsdk
ENV EM_CONFIG /root/emsdk/.emscripten
ENV EM_CACHE /root/emsdk/upstream/emscripten/cache
ENV EMSDK_NODE /root/emsdk/node/12.18.1_64bit/bin/node

WORKDIR /root

RUN node --version && cmake --version && clang --version && em++ --version && env

# RUN /root/emsdk/emsdk_env.sh

ENTRYPOINT ["/bin/bash", "-l", "-c"]