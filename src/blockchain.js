const CryptoJS = require("crypto-js");

class Block {
    constructor(index, hash, previousHash, timestamp, data) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
}
//SHA256
//https://passwordsgenerator.net/sha256-hash-generator/

const genesisBlock = new Block(
    0,
    "94CF764FBCBBCF46D5129C776BBE3558CFA0B5AA4A52A5560D81267BDC3AB0C3",
    null,
    1536210753013, //new Date().getTime()
    "This is the genesis!!"
);

let blockchain = [genesisBlock];

console.log(blockchain);

const getLastBlock = () => blockchain[blockchain.length - 1];
/*ES6 warning: code below is old js ver.
function getLastBlock() {
    return blockchain[blockchain.length - 1];
}
*/
const getTimestamp = () => new Date().getTime() / 1000;

const getBlockchain = () => blockchain;

const createHash = (index, previousHash, timestamp, data) =>
    CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString();


const createNewBlock = data => {
    const previousBlock = getLastBlock();
    const newBlockIndex = previousBlock.index + 1;
    const newTimestamp = getTimestamp();
    const newHash = createHash(
        newBlockIndex,
        previousBlock.hash,
        newTimestamp,
        data
    );
    const newBlock = new Block(
        newBlockIndex,
        newHash,
        previousBlock.hash,
        newTimestamp,
        data
    );
    return newBlock;
};

const getBlocksHash = (block) =>
createHash(
    block.index,
    block.previousHash,
    block.timestamp,
    block.data
)

const isNewBlockValid = (candidateBlock, latestBlock) => {
    if(!isNewStructureValid(candidateBlock)){
        console.log('The candidate block structure is not valid');
        return false;
    }
    else if(latestBlock.index + 1 !== candidateBlock.index){
        console.log(`The candidate block doesn't have a valid index`)
        return false;
    } else if(latestBlock.hash !== candidateBlock.previousHash){
        console.log(
            "The previousHash of the candidate block is not the hash of the latest block"
        );
        return false;
    } else if(getBlocksHash(candidateBlock) !== candidateBlock.hash){
        console.log("The hash of this block is invalid");
        return false;
    }
    return true;
};

const isNewStructureValid = (block) => {
    return (
        typeof block.index === 'number' &&
        typeof block.hash === "string" &&
        typeof block.previousHash === "string" &&
        typeof block.timestamp === "number" &&
        typeof block.data ==="string"
    );
};

const isChainValid = (candidateChain) => {
    const isGenesisValid = block => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if(!isGenesisValid(candidateChain[0])){
        console.log("The candidateChains' genesisBlock is not the same as our genesisBlock"
        );
        return false;
    }
    for(let i = 1; i < candidateChain.length; i++){
        // i = 1, b/c needless of genesisBlock validation.
        if(!isNewBlockValid(candidateChain[i], candidateChain[i-1])){
            return false;
        }
    }
    return true;
};

const replaceChain = candidateChain => {
    if(isChainValid(candidateChain) &&
    candidateChain.length > getBlockchain().legnth){
        blockchain = candidateChain;
        return ture;
    } else {
        return false;
    }
};

const addBlockToChain = candidateBlock => {
    if(isNewBlockValid(candidateBlock, getLastBlock())){
        getBlockchain().push(candidateBlock);
        return true;
    } else {
        return false;
    }
};