const sql = require('mssql');
const typeMapping = {
    // totally 33 sql. As defined in:
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/96f1ee52c
    // 61c5072b31c7d9dafd84aa9b5b2534c/sql/mssql/index.d.ts
    // left side is from database, the data_type field in information.parameters table.
    // right side is type definition in mssql.
    // 8 numeric sql

    int: sql.Int,
    numeric: sql.Numeric,
    bigint: sql.BigInt,
    tinyint: sql.TinyInt,
    smallint: sql.SmallInt,
    float: sql.Float,
    decimal: sql.Decimal,
    real: sql.Real,

    varchar: sql.VarChar,
    bit: sql.Bit,
    char: sql.Char,

    nvarchar: sql.NVarChar,
    varbinary: sql.VarBinary,
    text: sql.Text,

    // date time sql
    datetime: sql.DateTime,
    datetime2: sql.DateTime2,
    datetimeoffset: sql.DateTimeOffset,
    smalldatetime: sql.SmallDateTime,
    time: sql.Time,
    date: sql.Date,

    uniqueidentifier: sql.UniqueIdentifier,
    smallmoney: sql.SmallMoney,
    money: sql.Money,
    binary: sql.Binary,
    image: sql.Image,
    xml: sql.Xml,
    nchar: sql.NChar,
    ntext: sql.NText,
    tvp: sql.TVP,
    udt: sql.UDT,
    geography: sql.Geography,
    geometry: sql.Geometry,
    variant: sql.Variant
}

module.exports = typeMapping;
