const PASSED = (msg) => console.log(`✅ [${msg}]`);
const FAILED = (msg) => { throw new Error(`❌ [${msg}]`) }

/**
 * 
 * Get the correct schema from a list of schema files, first based on the
 * "chain" variable, if it's EVM then check if it has "standardContractType" 
 * property, which is a basic schema, if not then it should be evm contract
 * schema
 * 
 * @param acc 
 * @param schemas 
 * @returns 
 */
const getSchema = (acc: any, schemas: any) => {
        
    let schema: object;
    let arr: any;

    arr = schemas.filter((schema) => schema.properties.chain.enum.includes(acc.chain));

    schema = arr.length == 1 
            ? arr[0]
            : Object.keys(acc).includes('standardContractType')
                ? arr.find((schema: any) => schema.required.includes('standardContractType'))
                : arr.find((schema: any) => schema.required.includes('functionAbi'));


    return schema;
}

/**
 * 
 * Check if each required key exists in the acc 
 * and both given acc and required keys must have the same 
 * length of keys
 * 
 * @param acc 
 * @param requiredKeys 
 */
const mustMatchRequiredKeys = (acc, requiredKeys) => {

    if(Object.keys(acc).length !== requiredKeys.length){

        let unknownKeys = [];
        
        if ( Object.keys(acc).length > requiredKeys.length){
            unknownKeys = Object.keys(acc).filter((key) => ! requiredKeys.includes(key));
            FAILED(`Required keys and given acc length don't match. Found unknown keys [${unknownKeys}]`);
        }else{
            unknownKeys = requiredKeys.find((key) => ! Object.keys(acc).includes(key));
            FAILED(`Keys are missing: [${unknownKeys}]`);
        }
        
    }

    requiredKeys.forEach((key) => {

        // each required key must exist in the given 
        if(! Object.keys(acc).includes(key)){
            FAILED(`${key} is missing}`);  
        };
    });

    PASSED(`${requiredKeys.length} mustMatchRequiredKeys`)
}

/**
 * Get the type of a variable
 * @param val 
 * @returns 
 */
const getVarType = (val) => Object.prototype.toString.call(val).slice(8, -1).toLowerCase();

/**
 * Each property must match the given type in the 
 * @param acc 
 * @param properties 
 */
const mustMatchGivenTypes = (acc: any, properties: any) => {

    let propKeys = Object.keys(properties);

    propKeys.forEach((propKey, i) => {
        
        const prop = properties[propKey];

        // -- recursivly check sub properties
        if(prop.properties){
            mustMatchGivenTypes(acc[propKey], prop.properties);
        }
        
        // -- if a type is specified, then must match
        if(prop.type){

            const inputType = getVarType(acc[propKey]);
            const requiredType = prop.type;

            // console.log(`...checking ${propKey}: ${inputType} === ${requiredType}`)
            
            if( requiredType !== inputType){
                FAILED(`"${propKey}":"${acc[propKey]}" ${inputType} !== ${requiredType}`);
            }
            
        }

        // -- if a list of enum is specified, then must match one of it
        else if(prop.enum){

            const inputType = acc[propKey];
            const supportedList = prop.enum;            

            if( ! supportedList.includes(inputType) ){
                FAILED(`Cannot find ${inputType} in schema.`);
            }
        }
    })
    PASSED(`${Object.keys(properties).length} keys matched given types`)
}

/**
 * 
 * @param accs Access Control Conditions
 */
const validate = (accs: any) => {

    let result = [...new Array(accs.length)];

    // -- validate each access control
    [...accs].forEach((acc, i) => {

        // -- skip to next acc if it's a operator
        if(acc?.operator) return;

        // -- Pick the correct schema
        let schema : any = getSchema(acc, [
            require('./schemas/LPACC_EVM_BASIC.json'),
            require('./schemas/LPACC_EVM_CONTRACT.json'),
            require('./schemas/LPACC_SOL.json'),
            require('./schemas/LPACC_ATOM.json')
        ]);

        // -- check acc has all the keys that stated in the schema
        console.log(`---------------`);
        console.log(`...checking ${acc.chain} on ${schema.title} schema`);
        mustMatchRequiredKeys(acc, schema.required);
        mustMatchGivenTypes(acc, schema.properties);
    })

    let totalPasses : number = (result.map((r) => r == 'passed')).length;

    if( totalPasses < accs.length ) throw Error('Failed to validate')
}

// TODO: schema/structural level validation
// TODO: semantic level validation
// TODO: Regex validation on parameters :userAddress
// TODO: Based on the `chain` value, select the correct schema to check against
// TODO: 


(async() => {
    validate((await import('./cases/evm_basic')).default);
    // validate((await import('./cases/evm_contract')).default);
    // validate((await import('./cases/operators')).default);
    // validate((await import('./cases/timelock')).default);
    // validate((await import('./cases/domain')).default);
    // validate((await import('./cases/sol_1')).default);
    // validate((await import('./cases/sol_2')).default);
    // validate((await import('./cases/sol_3')).default);
    // validate((await import('./cases/sol_4')).default);
    // validate((await import('./cases/sol_5')).default);
    // validate((await import('./cases/cosmos_1')).default);
    // validate((await import('./cases/cosmos_2')).default);
    // validate((await import('./cases/kyve')).default);
})();

export { validate }