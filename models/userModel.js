const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide name']
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        validate: [validator.isEmail, 'Please provide valid email'],
        unique: true,
        lowercase: true,
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please provide password confirmation'],
        // this only works on save and create user 
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: "password are not same"
        } 
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true
    }
})

userSchema.methods.correctPassword = async (candidPassword, userPassword) => {
    return await bcrypt.compare(candidPassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if(this.passwordChangedAt) {
        const changedPassword = parseInt(this.passwordChangedAt.getTime()/1000,10)
        return  changedPassword > JWTTimeStamp
    }
    return false
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}

userSchema.pre(/^find/, function (next) {
    this.find({active: {$ne: false}})
    next()
})

userSchema.pre('save', function (next) {
    if(this.isModified('password') || this.isNew) {
        this.passwordChangedAt = Date.now()
    }
    next()
})

userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User