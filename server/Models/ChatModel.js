const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
            required: true,
        },
        namespace: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const ChatModel = mongoose.models.Chat
    ? mongoose.model("Chat")
    : mongoose.model("Chat", ChatSchema);

module.exports = ChatModel;