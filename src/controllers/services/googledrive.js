import constants from "../../config/constants";
import Storage from "./storage";
class GoogleDrive extends Storage {
  constructor({
    access_token,
    start_date,
    end_date,
    file_type,
    file_name,
    file_size,
    from,
    to,
  }) {
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
    const gmail = await google.gmail({ version: "v1", auth: this.init() });
    let list = await gmail.users.messages.list({
      userId: "me",
      q: await this.generateQuery(),
    });
    return list;
  }
}

const Gmail = new GoogleDrive();
export default Gmail;
