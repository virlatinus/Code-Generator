import DBConvertor from './DBConvertor'
import { ITableSQLite, IFieldSQLite, IIndexSQLite } from './IData'
import Entity from '../Schema/Entity'
import { IndexTypeEnum } from '../Schema/Index'
import { numberOrQuote } from '../Service/Text'

export default class SQLiteConvertor extends DBConvertor {
    getPresetKeyOfFieldType() {
        return 'FieldTypeSQLite'
    }

    getPresetKeyOfIncrementMap() {
        return 'IncrementSQLite'
    }

    convertTable(table: ITableSQLite, entity: Entity) {
        table.fields.forEach(field => {
            const fff = this.convertField(field, entity)
            this.editSpecialField(fff)
        })

        this.convertIndex(table, entity)
    }

    convertField(field: IFieldSQLite, entity: Entity) {
        const type = this.convertType(field)
        const fff = entity.fieldManager.make(field.name, type)
        entity.fieldManager.add(fff)

        if (!field.notnull) {
            fff.allowNull = true
        }

        if (field.dflt_value !== null) {
            if (field.dflt_value === 'CURRENT_TIMESTAMP') {
                fff.useCurrent = true
            } else {
                const value = field.dflt_value.replace(/::.+/, '')
                fff.value = numberOrQuote(value)
            }
        }

        const charMatch = field.type.match(/char\(([0-9]+)\)/i)
        if (charMatch) {
            fff.length = charMatch[1]
        }

        const floatMatch = field.type.match(/(float|decimal)\(([0-9]+),([0-9]+)\)/i)
        if (floatMatch) {
            fff.length = `${floatMatch[1]}, ${floatMatch[2]}`
        }

        return fff
    }

    convertIndex(table: ITableSQLite, entity: Entity) {
        table.indexes.forEach(index => {
            const list = this.getIndexFieldNameList(index)

            if (index.origin.includes('pk')) {
                this.addPrimary(list, entity)
                return
            }

            let type = IndexTypeEnum.index
            if (index.unique) {
                type = IndexTypeEnum.unique
            }
            this.addIndex(type, list, entity)
        })
    }

    addPrimary(list: Array<string>, entity: Entity) {
        if (list.length === 1) {
            const field = entity.fieldManager.find(list[0])
            if (field) {
                field.type = 'increments'
                field.value = ''
                const increment = this.getIncrement(field.type)
                if (increment) {
                    field.type = increment.tag
                }
            }
            return
        }

        this.addIndex(IndexTypeEnum.primary, list, entity)
    }

    addIndex(type: IndexTypeEnum, list: Array<string>, entity: Entity) {
        const index = entity.indexManager.make(entity.indexManager.list.length)
        index.type = type
        list.forEach(name => {
            const field = index.fieldManager.make(name.replace(' ', ''))
            index.fieldManager.add(field)
        })

        entity.indexManager.add(index)
    }

    getIndexFieldNameList(index: IIndexSQLite) {
        return index.columns.map(function(c){ return c.name});
    }

    convertType(field: IFieldSQLite) {
        const type = this.fieldManager.find(field.type)
        if (type) {
            return type.tag
        }
        return 'binary'
    }
}
