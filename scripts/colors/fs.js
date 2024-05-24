import fs from "fs";

/**
 * Function to save some data string into some file path.
 * @param {string} filePathStr 
 * @param {string} dataStr 
 */
const saveFileStr = (filePathStr, dataStr) => fs.writeFileSync(filePathStr, dataStr);

export { saveFileStr }