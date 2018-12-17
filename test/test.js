const expect= require('chai').expect;
const getConnectionPool= require('../src/db');

describe('getConnectionPool',()=>{
    it('should be a function',()=>{
        expect(getConnectionPool).to.be.a('function');
    } );
});