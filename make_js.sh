#!/bin/bash
pushd webapp
echo ================================
echo UI build STARTED
echo ================================
npm install --legacy-peer-deps 2>&1
if [ $? -eq 0 ]; then
    echo npm package installation SUCCEED for UI
else
    npm cache clean --force 2>&1
    sleep 10
    npm install 2>&1
    if [ $? -eq 0 ]; then
        echo npm package installation SUCCEED for UI
    else
        echo ======================================
        echo npm package installation FAILED for UI
        echo ======================================
        exit 1
    fi
fi
npm run build 2>&1
if [ $? -eq 0 ]; then
    echo UI build SUCCEED
else
    echo ================================
    echo UI build FAILED
    echo ================================
    exit 1
fi
popd
pushd server
echo ================================
echo Server build STARTED
echo ================================
if [ $? -eq 0 ]; then
    echo npm package installation SUCCEED for Server
else
    npm cache clean --force 2>&1
    sleep 10
    npm install 2>&1
    if [ $? -eq 0 ]; then
        echo npm package installation SUCCEED for Server
    else
        echo ==========================================
        echo npm package installation FAILED for Server
        echo ==========================================
        exit 1
    fi
fi
npm run build 2>&1
if [ $? -eq 0 ]; then
    echo Server build SUCCEED
else
    echo ================================
    echo Server build FAILED
    echo ================================
    exit 1
fi
popd
