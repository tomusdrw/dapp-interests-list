
contract InterestListCreator {
    uint constant CREATION_COST = 1 ether;
    
    event ListCreated(
        byte[50] indexed parent,
        byte[50] indexed name,
        address indexed target
    );

    function createList(byte[50] _parent, byte[50] _name)
    onlyWithCreationCost {
        address t = new InterestsList(_parent, _name);
        ListCreated(_parent, _name, t);
    }
    
    modifier onlyWithCreationCost {
        if (msg.value != CREATION_COST) throw;
    }
}

contract InterestsList {
    
    uint constant MIN_ENTRY_COST = 0.5 ether;
    uint constant MIN_MESSAGE_COST = 0.01 ether;

    struct Message {
        // Address submiting the message
        address submitter;
        // Address that will receive donations
        address beneficiary;
        // Title
        string title;
        // Message
        string message;
        // Deposit of the message
        uint deposit;
        // Deadline (when the message will free a slot)
        uint deadline;
        // Total amount of donations
        uint donations;
    }
    
    struct Member {
        uint balance;
        uint donated;
    }
    
    // Events
    event Changed(
        uint8 indexed slotNo,
        address indexed submitter,
        address indexed beneficiary,
        uint deposit,
        uint donationBurned
    );
    
    event Donated(
        address indexed from,
        address indexed to,
        uint indexed amount
    );
    
    /// Storage
    Message[8] messages;
    
    byte[50] parent;
    byte[50] name;
    uint totalTokens;
    mapping(address => Member) members;
    
    function InterestsList(byte[50] _parent, byte[50] _name) {
        parent = _parent;
        name = _name;
    }
    
    function totalBalance() constant returns (uint totalBalance) {
        return totalTokens;
    }
    
    function balanceOf(address who) constant returns (uint balanceOfAddress) {
        return members[who].balance;
    }
    
    function submitMessage(uint8 _slotNo, uint burnDonated, address _beneficiary, string _title, string _message)
    {
        uint value = msg.value + burnDonated;   
        bool deadlineReached = now > messages[_slotNo].deadline;
        
        // Check if min cost of message is reached
        if (value < MIN_MESSAGE_COST) throw;
        // Check if you have enough donation tokens to spend
        if (burnDonated > members[msg.sender].donated) throw;
        
        // Verify that we can take this spot
        if (
            (!deadlineReached && messages[_slotNo].deposit > value / 2)
            || _slotNo >= messages.length
        ) throw;
        
        // Burn donation tokens
        members[msg.sender].donated -= burnDonated;
          
        // Otherwise takeover the spot
        // But refund the original bidder
        // (if deadline was not reached yet)
        if (!deadlineReached) {
            messages[_slotNo].submitter.send(messages[_slotNo].deposit);
        }
        
        // Assign your own messages
        messages[_slotNo] = Message(
            msg.sender,
            _beneficiary,
            _title,
            _message,
            msg.value, // Don't store donated here!
            now + (1 days),
            0
        );
        
        Changed(_slotNo, msg.sender, _beneficiary, msg.value, burnDonated);
    }
    
    function donate(uint8 _slotNo, address _beneficiary, uint _amount)
    onlyMember {
        var message = messages[_slotNo];
        // Verify beneficiary
        if (message.beneficiary != _beneficiary) throw;
        // Verify the owner
        if (message.beneficiary == msg.sender) throw;
        // Verify balance
        if (members[msg.sender].balance <= _amount) throw;
        
        // Calculate amount
        message.donations += _amount;
        members[msg.sender].donated += _amount;
        members[msg.sender].balance -= _amount;
        totalTokens -= _amount;
        // And finally send
        _beneficiary.send(_amount);
        Donated(msg.sender, _beneficiary, _amount);
    }
    
    function () {
        join();
    }
    
    function join()
    onlyWithMinEntry {
        // Tokens created
        uint tokens = msg.value - MIN_ENTRY_COST;
        
        totalTokens += tokens;
        members[msg.sender].balance += tokens;
    }
    
    function leave()
    onlyMember {
        var reward = members[msg.sender].balance * this.balance / totalTokens;
        totalTokens -= members[msg.sender].balance;
        delete members[msg.sender];
        msg.sender.send(reward);
    }
    
    modifier onlyWithMinEntry {
        if (msg.value <= MIN_ENTRY_COST) throw;
    }
    
    modifier onlyMember {
        if (members[msg.sender].balance == 0) throw;
        _
    }
}
