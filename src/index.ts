declare global {
    interface Window {
        litValidatorStatus: object;
    }
}

if(typeof window !== 'undefined'){
    global.litValidatorStatus = { status: 'init', msg: '' };

}

const PASSED = (msg) => {
    if(global){
        global.litValidatorStatus = { status: 'PASSED', msg };
    }
    console.log(`✅ [${msg}]`);
};  
const FAILED = (msg) => { 
    if(global){
        global.litValidatorStatus = { status: 'FAILED', msg };
    }
    throw new Error(`❌ [${msg}]`);
 }

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
const getSchema = (acc: any, schemas: any = [
    require('./schemas/LPACC_EVM_BASIC.json'),
    require('./schemas/LPACC_EVM_CONTRACT.json'),
    require('./schemas/LPACC_SOL.json'),
    require('./schemas/LPACC_ATOM.json')
]) => {
        
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
            FAILED(`${key} is missing`);  
        };
    });

    // PASSED(`${requiredKeys.length} mustMatchRequiredKeys`)
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
const mustMatchGivenTypes = (acc: any, properties: any, schemaName: string = '') => {

    let propKeys = Object.keys(properties);

    console.log(propKeys);
    

    propKeys.forEach((propKey, i) => {

        console.log("propKey:", propKey);
        
        const prop = properties[propKey];

        // -- recursivly check sub properties
        if(prop.properties){
            console.log("-- deeper --");
            mustMatchGivenTypes(acc[propKey], prop.properties, schemaName);
        }
        
        // -- if a type is specified, then must match
        if(prop.type){

            const inputType = getVarType(acc[propKey]);
            const requiredType = prop.type;

            // -- cannot be empty
            if(inputType === 'undefined'){
                FAILED(`key "${propKey}" is missing. Please check schema ${schemaName}`);
            }

            console.log(`...checking ${propKey}: ${inputType} === ${requiredType}`)
            
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
    // PASSED(`${Object.keys(properties).length} keys matched given types`)
}

/**
 * 
 * @param accs Access Control Conditions
 */
const validate = (accs: any) => {

    if( ! accs ){
        FAILED("validate() param 'accs' cannot be empty!")
    }

    let result = [...new Array(accs.length)];
    let validSchemas = [];

    // -- validate each access control
    [...accs].forEach((acc, i) => {

        // -- skip to next acc if it's a operator
        if(acc?.operator) return;

        // -- Pick the correct schema
        let schema : any = getSchema(acc);

        // -- check acc has all the keys that stated in the schema
        console.log(`---------------`);

        // -- If it's array (poap)
        if( getVarType(acc) == 'array'){
            validate(acc);
        }else{
            console.log(`...checking ${acc.chain} on ${schema.title} schema`);
            mustMatchRequiredKeys(acc, schema.required);
            mustMatchGivenTypes(acc, schema.properties, schema.title);
    
            if( ! validSchemas.includes(schema.title) ){
                validSchemas.push(schema.title)
            }
        }
        
    })

    let totalPasses : number = (result.map((r) => r == 'passed')).length;

    if( totalPasses < accs.length ) FAILED('Failed to validate')

    PASSED(validSchemas);

    return true
}

// TODO: schema/structural level validation
// TODO: semantic level validation
// TODO: Regex validation on parameters :userAddress
// TODO: Based on the `chain` value, select the correct schema to check against
// TODO: 


// -- Run this once so it gets imported to `src_built_from_ts`
(async() => {
    validate((await import('./cases/missingKey')).default);
    // validate((await import('./cases/returnValueTrueIsString')).default);
    // validate((await import('./cases/evm_basic')).default);
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

const testCases = [
    require('./cases/evm_basic').default,
    require('./cases/evm_contract').default,
    require('./cases/operators').default,
    require('./cases/timelock').default,
    require('./cases/domain').default,
    require('./cases/sol_1').default,
    require('./cases/sol_2').default,
    require('./cases/sol_3').default,
    require('./cases/sol_4').default,
    require('./cases/sol_5').default,
    require('./cases/cosmos_1').default,
    require('./cases/cosmos_2').default,
    require('./cases/kyve').default,
];

export { 
    validate,
    testCases,
    getSchema
}