import { Injectable } from "@nestjs/common";
const Minio = require("minio");
import delDir from "../common/utils/delDir";
const path = require("path");
const fullPath = path.resolve("./src/uploads");
import config from "config";

@Injectable()
export class UploadService {
  // 上传文件
  async upload(req, path: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // minio上传文件
      let minioClient = new Minio.Client({
        endPoint: config.minio.endPoint,
        port: config.minio.port,
        useSSL: true,
        rootUser: config.minio.rootUser,
        rootPassword: config.minio.rootPassword,
      });

      let file = req.file.path;
      let metaData = {
        "Content-Type": "application/octet-stream",
        "X-Amz-Meta-Testing": 1234,
        example: 5678,
      };
      console.log(req.file);
      // 上传文件
      minioClient.fPutObject(
        `resume`,
        `/${path}/${req.file.filename}`,
        file,
        metaData,
        (err, etag) => {
          if (err) {
            console.log("文件上传失败", err);
            reject(err);
          } else {
            let responseData = {
              fileName: req.file.originalname,
              fileUrl:
                `https://smallpig.site:9000/resume/${path}/` + req.file.filename,
              fileSize: req.file.size,
            };
            delDir(fullPath); // 删除本地临时文件夹
            console.log("文件上传成功", responseData);
            resolve(responseData);
          }
        }
      );
    });
  }
}
