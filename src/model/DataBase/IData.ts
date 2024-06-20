export enum DriverEnum {
    mysql = 'mysql',
    pgsql = 'pgsql',
    sqlite = 'sqlite',
}

export interface IData {
    driver: DriverEnum
    database: string
    prefix: string
    tables: Array<ITableMySQL | ITablePGSQL | ITableSQLite>
}

export interface ITable {
    included: boolean
    name: string
}

export interface ITableSQLite extends ITable {
    fields: Array<IFieldSQLite>
    indexes: Array<IIndexSQLite>
}

export interface IFieldSQLite {
    cid: number
    name: string
    type: string
    notnull: number
    dflt_value: string
    pk: number
}

export interface IIndexColumnSQLite {
    seqno: number
    cid: number
    name: string
}

export interface IIndexSQLite {
    seq: number
    name: string
    unique: number
    origin: string
    partial: number
    columns: Array<IIndexColumnSQLite>
}

export interface ITableMySQL extends ITable {
    fields: Array<IFieldMySQL>
    indexes: Array<IIndexMySQL>
}

export interface IFieldMySQL {
    Field: string
    Default: string
    Extra: string
    Key: string
    Null: string
    Type: string
}

export interface IIndexMySQL {
    Column_name: string
    Key_name: string
    Non_unique: number
    Seq_in_index: number
    Table: string
}

export interface ITablePGSQL extends ITable {
    fields: Array<IFieldPGSQL>
    indexes: Array<IIndexPGSQL>
}

export interface IFieldPGSQL {
    character_maximum_length: number
    column_name: string
    column_default: string
    numeric_scale: number
    numeric_precision: number
    is_nullable: string
    data_type: string
}

export interface IIndexPGSQL {
    indexdef: string
    indexname: string
}
