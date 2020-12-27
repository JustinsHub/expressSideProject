//Error handles general errors with your own message and status

class ExpressError extends Error {
    constructor(message, status){
        super()
        this.message = message
        this.status = status
        console.error(this.stack)
    }
}

module.exports = ExpressError