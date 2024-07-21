import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the propertiwes 
// that required to create a new user
interface UserAtrrs {
    email: string,
    password: string
}

// An interface that describes the properties
// that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAtrrs): UserDoc;
}

//An interface that describwes the properties that User Document has
// that saved record has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) { 
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

// Using normal function to access the this
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
})

// thats function is meant to allow ts to do validation
// becuase when we use directly new User it doesnt check
userSchema.statics.build = (attrs: UserAtrrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };