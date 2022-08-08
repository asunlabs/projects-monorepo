# Hands-on smart contract

Tips and tricks from Hands-on smart contract book is oragnized here

## Codes

struct added
emit NewWorkCreated
count++
destructuring to get inidividual values

Example

// destructuring
mapping(address ☞ Work[]) private \_work
func myWork

uint count = getMyWorkCount()
values = new uint[](count)
dates = new uint[](count)

for
Work storage work = \_work[msg.sender][i]
values[i] = work.value
dates[i] = work.date

return (values, dates)

getCounts(address owner) uint256
return \_work[owner].length

// factory pattern
Instance[] private \_instances // instance is a contract and the array stores the address of it.
MAX_LIMIT_OF_INSTANCE private = 100
MAX_LIMIT_OF_QUERIES public = 10
Event NewInstanceCreated

createInstance
\_instances.push(Instance)
emit NewInstanceCreated(Instance indexed instance, address indexed owner) // don't forget to emit event

getInstanceCount
return \_instances.length

setMaximumInstance() // limit a maximum amount of array can hold
