import { expect } from "chai";
import { validate, testCases, getSchema } from '../build/node/index';

describe('Access Control Conditions test', () => { // the tests container

    testCases.forEach((testCase, i) => {

        testCase.forEach((acc, y) => {
            const chain = acc?.chain;
            const schema = getSchema(acc)?.title;

            if( ! acc?.operator ){
                it(`${i} Testing ${chain} on schema: ${schema}`, async () => { // the single test
                    expect(await validate(testCase)).to.be.equal(true)
                });
            }

        })
        
    })
});