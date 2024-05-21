#!/bin/bash
# This script is used to test invocations of ChainCode in a local environment

log_file="invocation.log"
error_log_file="invocation_error.log"

: > $log_file
: > $error_log_file

exec > >(tee -a $log_file) 2> >(tee -a $error_log_file >&2)

# Verify if current folder is 'test-network'
if [ "$(basename "$PWD")" != "test-network" ]; then
    echo "Current directory is not 'test-network'. Changing directory to '../../fabric-samples/test-network'."
    cd ../../fabric-samples/test-network || { echo "Failed to change directory to '../../fabric-samples/test-network'"; exit 1; }
else
    echo "Current directory is 'test-network'. Continuing..."
fi



# Example invocation (replace with your actual chaincode function and args)

# Invoke GetAllArtifacts with empty response
invoke_output=$(peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"GetAllArtifacts","Args":["2", "bookmark"]}' 2>&1)


sleep 1

# Assert output
expected_output='Chaincode invoke successful. result: status:200 payload:"{\"artifacts\":[],\"bookmark\":\"\"}"'

echo "========= GetAllArtifacts Tests ==========="

if [[ "$invoke_output" == *"$expected_output"* ]]; then
    echo "Assertion passed: Empty Artifact List returned successfully."
else
    echo "Assertion failed: Empty Artifact List not returned successfully."
    echo "Expected: $expected_output"
    echo "Got: $invoke_output"
fi

# Invoke CreateArtifact with a string instead of an integer

invoke_output=$(peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"GetAllArtifacts","Args":["NotANumber", "bookmark"]}' 2>&1)

sleep 1

# Assert output

expected_output='Error: endorsement failure during invoke. response: status:500 message:"Error managing parameter param0. Conversion error. Cannot convert passed value NotANumber to int32"'

if [[ "$invoke_output" == *"$expected_output"* ]]; then
    echo "Assertion passed: Error message returned successfully."
    else
    echo "Assertion failed: Error message not returned successfully."
    echo "Expected: $expected_output"
    echo "Got: $invoke_output"
fi


# Add more invocations and checks as needed


# ./network.sh down

cd $CC_SRC_PATH
