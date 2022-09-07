import { SettingsDto } from "./settings.dto";
import { PhotoDto } from "../../common/dto/photo.dto";

export class UserDto {
  constructor(object: any) {
    this.name = object.name;
    this.surname = object.surname;
    this.email = object.email;
    this.phone = object.phone;
    this.birthdaydate = object.birthdaydate;
    this.date = object.date;
    this.settings = new SettingsDto(object.settings);
    // console.log("object.auth", object.auth.email.valid);
    this.auth = {
      email: {
        valid: object.auth.email.valid,
      },
    };
    this.photos = {
      profilePic: new PhotoDto(object.photos.profilePic),
      gallery: [],
    };
    if (object.photos && object.photos.gallery) {
      object.photos.gallery.forEach((photo) => {
        this.photos.gallery.push(new PhotoDto(photo));
      });
    }
    // 添加角色
    this.roles = [];
    if (object.roles) {
      object.roles.forEach((item) => {
        this.roles.push(item);
      });
    }
  }
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly phone: string;
  readonly birthdaydate: Date;
  date: string;
  roles: Array<string>;
  auth: {
    email: {
      valid: boolean;
    };
  };
  settings: SettingsDto;
  photos: {
    profilePic: PhotoDto;
    gallery: PhotoDto[];
  };
}
