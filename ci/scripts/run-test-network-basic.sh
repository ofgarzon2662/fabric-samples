#!/bin/bash

set -euo pipefail

CHAINCODE_LANGUAGE='go'
CHAINCODE_PATH='/home/runner/work/OSC-Chaincode/chaincode/'

function print() {
	GREEN='\033[0;32m'
  NC='\033[0m'
  echo
	echo -e "${GREEN}${1}${NC}"
}

function createNetwork() {
  print "Creating 3 Org network"
  ./network.sh up createChannel -ca -s couchdb
  cd addOrg3
  ./addOrg3.sh up -ca -s couchdb
  cd ..
}

function deployChaincode() {
  print "Deploying ${CHAINCODE_NAME} chaincode"
  ./network.sh deployCC -ccn "${CHAINCODE_NAME}" -ccp "${CHAINCODE_PATH}" -ccv 1 -ccs 1 -ccl "${CHAINCODE_LANGUAGE}"
}

function stopNetwork() {
  print "Stopping network"
  ./network.sh down
}

# print all executed commands to assist with debug in CI environment
set -x

# Set up one test network to run each test scenario.
# Each test will create an independent scope by installing a new chaincode contract to the channel.
createNetwork


# Run Go application
print "Initializing Go application"
export CHAINCODE_NAME=basic_${CHAINCODE_LANGUAGE}_for_go_app
deployChaincode
pushd ../asset-transfer-basic/application-go
print "Executing AssetTransfer.go"
go run .
popd

stopNetwork

{ set +x; } 2>/dev/null
