const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
    nick: { type: String, require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group'}],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    picture: String,
},{
    timestamps: true
});

const GroupMember = mongoose.model('GroupMember', groupMemberSchema);

module.exports = GroupMember;