import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class Post extends Document {
    @Prop() firstName: string;
    @Prop() lastName: string;
    @Prop() profileImage: string;
    @Prop({ required: true }) username: string;
    @Prop({ required: true }) content: string;
    @Prop() image?: string;

    @Prop({
        type: [{
            username: String,
            firstName: String,
            lastName: String,
            profileImage: String
        }],
        default: [],
    })
    likes: {
        username: string;
        firstName: string;
        lastName: string;
        profileImage: string;
    }[];

    @Prop({
        type: [{
            username: String,
            firstName: String,
            lastName: String,
            profileImage: String,
            content: String,
            date: Date,
            modified: Boolean,
            deleted: { type: Boolean, default: false }
        }],
        default: [],
    })
    comments: {
        username: string;
        firstName: string;
        lastName: string;
        profileImage: string;
        date: Date;
        content: string;
        modified?: boolean;
        deleted?: boolean;
    }[];

    @Prop({ default: Date.now })
    date: Date;

    @Prop({ default: true })
    show: boolean;

    @Prop({ default: false })
    deleted: boolean;

    @Prop()
    deletedBy?: string;

    @Prop()
    deletedAt?: Date;
}
export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);

// export class Post extends Document {

//     @Prop()
//     firstName: string;

//     @Prop()
//     lastName: string;

//     @Prop()
//     profileImage: string;

//     @Prop({ required: true })
//     username: string;

//     @Prop({ required: true })
//     content: string;

//     @Prop()
//     image?: string;

//     @Prop({ type: [String], default: [] })
//     likes: string[];

//     @Prop({
//         type: [{ username: String, content: String }],
//         default: [],
//     })
//     comments: { username: string; content: string }[];

//     @Prop({ default: Date.now })
//     date: Date;

//     @Prop({ default: true })
//     show: boolean;
// }