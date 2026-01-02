import {
    Schema,
    SchemaDefinition,
    SchemaOptions,
    SchemaTypeOptions,
    Document,
} from 'mongoose'

export interface IDocument extends Document {
    _id: any
    toHexString: () => string
}

interface CustomSchemaOptions extends SchemaOptions {
    toJSON?: SchemaTypeOptions<IDocument>['options']['toJSON'] & {
        transform?: (doc: IDocument, ret: any) => any
    }
}

/**
 * Creates a Mongoose schema with common defaults:
 * - Adds a virtual `id` (string version of `_id`)
 * - Removes `_id` and `__v` from output
 * - Includes virtuals and getters in `toJSON`/`toObject`
 * - Enables timestamps by default
 */
const createSchema = (
    definition: SchemaDefinition,
    options: CustomSchemaOptions = {}
): Schema => {
    // Default to timestamps: true
    options.timestamps = options.timestamps ?? true

    const newSchema = new Schema(definition, options)

    // Virtual id from _id
    newSchema.virtual('id').get(function (this: IDocument) {
        return this._id?.toHexString()
    })

    // Set toObject with virtuals and optional getters
    newSchema.set('toObject', {
        virtuals: true,
        getters: options.toObject?.getters,
        flattenMaps: true,
    })

    // Default transformation for toJSON
    const defaultTransform = (doc: any, ret: any) => {
        delete ret._id
        delete ret.__v
        return ret
    }

    // Set toJSON with virtuals, optional getters, and custom + default transform
    newSchema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        getters: options.toJSON?.getters,
        flattenMaps: true,
        transform: (doc: any, ret: any) => {
            // Apply user-defined transform first
            if (typeof options.toJSON?.transform === 'function') {
                options.toJSON.transform(doc, ret)
            }

            // Special handling for Map types to convert to plain objects
            if (ret.attributes instanceof Map) {
                ret.attributes = Object.fromEntries(ret.attributes.entries())
            }

            // Then apply default transform
            return defaultTransform(doc, ret)
        },
    })

    return newSchema
}

export default createSchema
