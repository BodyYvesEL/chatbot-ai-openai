const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        chatId: {
            type: String,
            required: true,
        },
        namespace: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Message = mongoose.models.Message
    ? mongoose.model("Message")
    : mongoose.model("Message", MessageSchema);

module.exports = Message;