pragma solidity >=0.4.21 <0.6.0;

contract DappToken {
 
    uint256 public totalSupply;
    string  public name     = 'DApp Token';
    string  public symbol   = 'DAPP';
    string  public standard = 'DApp Token v1.0';


    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor(uint256 _initalSupply) public {
        balanceOf[msg.sender] = _initalSupply;
        totalSupply = _initalSupply;

    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value,"Only chairperson can give right to vote.");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // function name() public view returns (string)

    // function balanceOf(address _owner) public {

    // }
 
}
