import { AttachmentsAccess } from "../../helpers/attachmentUtils";

const attachmentsAccess = new AttachmentsAccess();
export const createAttachmentPresignedUrl = (todoId: string) => {
  return attachmentsAccess.getUploadUrl(todoId);
}


