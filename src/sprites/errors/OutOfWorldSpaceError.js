export class OutOfWorldSpaceError extends Error {
    constructor(message) {
        super(message); // Call the parent class constructor with the message
        this.name = "OutOfWorldSpaceError"; // Set the exception name
        this.code = 1001; // Optional: Add a custom property
    }
}