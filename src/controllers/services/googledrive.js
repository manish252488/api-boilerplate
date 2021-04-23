import { google } from "googleapis";
import constants from "../../config/constants";
import Storage from "./storage";
class Gmail extends Storage {
  constructor({
    access_token = "",
    start_date = "",
    end_date = "",
    file_type = "",
    file_name = "",
    file_size = "",
    from = "",
    to = "",
  }) {
    super();
    this.access_token = access_token;
    this.start_date = start_date;
    this.end_date = end_date;
    this.file_type = file_type;
    this.file_name = file_name;
    this.file_size = file_size;
    this.from = from;
    this.to = to;
  }
  init() {
    const oAuth2Client = new google.auth.OAuth2(
      constants.google.clientId,
      "http://localhost:3000"
    );

    let tokens = {
      access_token: this.access_token,
    };
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
  }

  async getFiles() {
    let query = "";
    if (this.start_date && this.start_date !== "") {
      query += `after:${this.start_date} `;
    }
    if (this.start_date && this.end_date !== "") {
      query += `before:${this.end_date} `;
    }
    if (this.file_name && this.file_name !== "") {
      query += `filename:${this.file_name} `;
    }
    if (this.file_type && this.file_type !== "") {
      query += `filename:${this.file_type} `;
    }
    if (this.file_size && this.file_size !== "") {
      query += `smaller:${this.file_size}`;
    }
    console.log("query gamil", query);
    const gmail = await google.gmail({ version: "v1", auth: this.init() });
    let list = await gmail.users.messages.list({
      userId: "me",
      q: "has:attachment in:inbox " + query,
    });
    let messages = [];
    let mails = list.data.messages;
    if (mails) {
      for (let i = 0; i < mails.length; i++) {
        let res = await gmail.users.messages.get({
          userId: "me",
          id: mails[i].id,
        });
        let subject = res.data.snippet;
        if (res.data.payload.parts && res.data.payload.parts.length > 0) {
          for (let j = 0; j < res.data.payload.parts.length; j++) {
            let part = res.data.payload.parts[j];
            if (part.filename !== "") {
              let file = {
                id: mails[i].id,
                subject: subject,
                filename: part.filename,
                body: part.body,
                type: part.mimeType,
              };
              console.log("-----------------------", part);
              messages.push(file);
            }
          }
        }
      }
      for (let k = 0; k < messages.length; k++) {
        let res = await gmail.users.messages.attachments.get({
          userId: "me",
          messageId: messages[k].id,
          id: messages[k].body.attachmentId,
        });
        messages[k].attachment = res.data.data;
      }
    } else throw new Error("NO Mails Found!");
    return messages;
  }
}
export default Gmail;
