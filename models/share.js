const mongoose = require('mongoose');
const validator = require('validator');

const shareSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    totalAmount: {
        type: Number,
        required: true,
        trim: true,
        validate(value){
            if(value <= 0) {
                throw new Error("Invalid value.");
            }
        }
    },
    users: [{
        userId: {
            type: String,
            required: true,
            trim: true
        },
        share: {
            type: Number,
            required: true
        }
    }],
    paidBy: {
        userId: {
            type: String,
            required: true,
            trim: true
        },
        amountPaid: {
            type: Number,
            required: true
        }
    }
}, {timestamps: true});


shareSchema.methods.toJSON = function() {
    let share = this;
    shareObject = share.toObject();
    return shareObject;
}

shareSchema.index({ 'users.userId': 1 });

shareSchema.statics.getUserShares = async function(userIds) {
    try {
        const shares = await Share.find({ 'users.userId': { $in: userIds } });
        return shares;
    } catch (error) {
        throw new Error("Error occurred while fetching data.");
    }
};

shareSchema.statics.getSharesByIds = async function(userIds) {
    try {
        const shares = await this.aggregate([
            {
                $match: {
                    'users.userId': { $all: userIds }
                }
            }
        ]);
        return shares;

    } catch (error) {
        throw new Error("Error occurred while fetching data." + error);
    }
};

const Share = new mongoose.model("share", shareSchema);

module.exports = Share;