// https://developer.litprotocol.com/docs/AccessControlConditions/solRpcConditions
export default [
    {
        method: "balanceOfMetaplexCollection",
        params: ["FfyafED6kiJUFwEhogyTRQHiL6NguqNg9xcdeoyyJs33"],
        chain: "solana",
        returnValueTest: {
        key: "",
        comparator: ">",
        value: "0",
        },
    },
];