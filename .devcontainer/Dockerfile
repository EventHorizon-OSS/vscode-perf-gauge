ARG UV_VERSION=0.13.7
ARG NODEJS_VERSION=26.13.0
ARG SPEC_KIT_VERSION=v1.3.2

FROM ghcr.io/astral-sh/uv:${UV_VERSION} AS uv

FROM ubuntu:26.04

ARG NODEJS_VERSION
ARG SPEC_KIT_VERSION

COPY --from=uv /uv /uvx /bin/

ENV PATH="/root/.local/bin:${PATH}"

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git gnupg openssh-client \
    && install -d -m 0755 /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
        | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && chmod 0644 /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODEJS_VERSION%%.*}.x nodistro main" \
        > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        "nodejs=${NODEJS_VERSION}*" \
    && apt-get purge -y --auto-remove curl gnupg \
    && rm -rf /var/lib/apt/lists/*

RUN uv tool install specify-cli \
    --from "git+https://github.com/github/spec-kit.git@${SPEC_KIT_VERSION}" \
    && specify version
