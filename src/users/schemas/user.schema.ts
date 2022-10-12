import * as mongoose from "mongoose";
export const UserSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    surname: {
      type: String,
      default: "一句话介绍自己",
    },
    email: String,
    phone: String,
    password: String,
    birthdaydate: Date,
    roles: [],
    auth: {
      email: {
        valid: { type: Boolean, default: false },
      },
      facebook: {
        userid: String,
      },
      gmail: {
        userid: String,
      },
    },
    settings: {},
    photos: {
      profilePic: {
        url: {
          type: String,
          default:
            "https://smallpig.site:9000/navigation/file-1662356569784.png",
        },
      }, //{ type:  mongoose.Schema.Types.ObjectId , ref: 'PhotoSchema'}
      gallery: [], //[{type:  mongoose.Schema.Types.ObjectId , ref: 'PhotoSchema'}]
    },
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);
