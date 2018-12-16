const sql = require('mssql');
const sqlWorker = require('./sqlWorker');
const logger = require('winston');
const debug = require('debug')('ws:procedureDefinition');


const typeMapping = {
    // totally 33 types. As defined in:
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/96f1ee52c
    // 61c5072b31c7d9dafd84aa9b5b2534c/types/mssql/index.d.ts
    // left side is from database, the data_type field in information.parameters table.
    // right side is type definition in mssql.

    // 8 numeric types
    int: TYPES.Int,
    numeric: TYPES.Numeric,
    bigint: TYPES.BigInt,
    tinyint: TYPES.TinyInt,
    smallint: TYPES.SmallInt,
    float: TYPES.Float,
    decimal: TYPES.Decimal,
    real: TYPES.Real,

    varchar: TYPES.VarChar,
    bit: TYPES.Bit,
    char: TYPES.Char,

    nvarchar: TYPES.NVarChar,
    varbinary: TYPES.VarBinary,
    text: TYPES.Text,

    // date time types
    datetime: TYPES.DateTime,
    datetime2: TYPES.DateTime2,
    datetimeoffset: TYPES.DateTimeOffset,
    smalldatetime: TYPES.SmallDateTime,
    time: TYPES.Time,
    date: TYPES.Date,

    uniqueidentifier: TYPES.UniqueIdentifier,
    smallmoney: TYPES.SmallMoney,
    money: TYPES.Money,
    binary: TYPES.Binary,
    image: TYPES.Image,
    xml: TYPES.Xml,
    nchar: TYPES.NChar,
    ntext: TYPES.NText,
    tvp: TYPES.TVP,
    udt: TYPES.UDT,
    geography: TYPES.Geography,
    geometry: TYPES.Geometry,
    variant: TYPES.Variant
}

module.exports = typeMapping;
