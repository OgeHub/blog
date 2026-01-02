class HttpException extends Error {
    public status: number
    public message: string
    public errors: string[] | undefined

    constructor(status: number, message: string, errors: string[] = []) {
        super(message)
        this.status = status
        this.message = message
        this.errors = errors?.length > 0 ? errors : undefined
    }
}

export default HttpException
