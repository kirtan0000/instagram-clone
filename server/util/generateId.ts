import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

// Huge id lol
const generateId = () =>
  `${uuidv4()}-${uuidv4()}-${uuidv4()}-${crypto
    .randomBytes(24)
    .toString("hex")}`;
    
export default generateId;
