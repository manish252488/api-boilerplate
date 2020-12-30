import AWS from 'aws-sdk';
import fs from 'fs'
import constants from '../config/constants';
import {randomName} from '../utils/randomName';
import chalk from 'chalk';
import util from 'util';
import { CodeNode } from 'source-list-map';

AWS.config.update({region: 'eu-central-1'});


const s3Client = new AWS.S3({
  accessKeyId: constants.AWS_ACCESS_KEY,
  secretAccessKey: constants.AWS_SECRET_ACCESS_KEY,
});

const uploadParams = {
  // Bucket: constants.BUCKET || process.env.BUCKET_DEV,
  Bucket: constants.BUCKET,
  // Key: 'usersFiles', // pass key
  Body: '', // pass file body
  ContentType: 'zip',
  ACL: 'public-read',
};

// const deleteParams = {
//   // Bucket: constants.BUCKET || process.env.BUCKET_DEV,
//   Bucket: constants.BUCKET
//   // Key: 'usersFiles', // pass key
// };

export async function uploadFile(file) {
  return new Promise(function(resolve, reject) {
    var fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err) {
      console.log('File Error', err);
    }); 
    uploadParams.Body = fileStream;
    var date=new Date()
    console.log(chalk.blueBright.italic(date));
    // console.log(util.inspect(name, {showHidden: false, depth: null}))
    uploadParams.Key=randomName(8)
    
      s3Client.upload(uploadParams,(err, data)=> {
          if (err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
  
    //deletes zip file from temp folder locally

    fs.unlinkSync(file,(err)=>{
      if (err){
        console.log("file could not be deleted")
      }
    });
  })
  }


  //use this  when deleting file from aws-s3
  // export async function deleteFile(){
  //   s3Client.deleteObject(deleteParams,(err,data)=>{
  //       if(err){
  //         console.log(err)
  //       }else if(data){
  //         console.log("file deleted successfully")
  //       }
  //   })
  // }

//   s3Client.upload(uploadParams,(err,data)=>{
//     if(err){
//         throw new Error(err)
//     }else if(data){
//       // console.log(util.inspect(data, {showHidden: false, depth: null}))
//       console.log(chalk.green(data.Location));
//       return data;
//     }
// });  