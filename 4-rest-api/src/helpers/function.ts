import { unlink } from "fs";
import path from "path";

const clearImage = (filePath: string) => {
  const arrayPath = filePath.split("/");
  const finalPath = path.join(__dirname, "..", "images", arrayPath[arrayPath.length - 1]);

  unlink(finalPath, (error) => {
    if (error) {
      throw error;
    }
  });
};

export { clearImage };
