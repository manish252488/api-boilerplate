import Gmail from "./services/googledrive";

export async function getFiles(req, res) {
  try {
    const list = await Gmail.getFiles();
    return res.success("files from mail!", list);
  } catch (err) {
    return res.error("error fetching files", err);
  }
}
