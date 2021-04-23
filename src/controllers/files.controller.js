import { fetchMailQueryValidation } from "../config/validations";
import Gmail from "./services/googledrive";

export async function getFiles(req, res) {
  try {
    await fetchMailQueryValidation(req.body);
    const gmail = new Gmail({
      access_token: req.query.access_token,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      file_name: req.body.file_name,
      file_size: req.body.file_size,
      file_type: req.body.file_type,
    });
    const list = await gmail.getFiles();
    return res.success("files from mail!", list);
  } catch (err) {
    return res.error("error fetching files", err);
  }
}
