pragma solidity ^0.4.24;

/** 
* @author Shubham Tatvamasi
*/
contract PrivateKeysBank {

  address[] public publicKeys;
  mapping (address => bool) public added;
  mapping (address => string) public keys;

  function newKey(address publicKey, string privateKey) public {
    require(added[publicKey] == false);
    keys[publicKey] = privateKey;
    added[publicKey] = true;
    publicKeys.push(publicKey);
  }

  function totalKeys() public view returns (uint) {
    return publicKeys.length;
  }

}