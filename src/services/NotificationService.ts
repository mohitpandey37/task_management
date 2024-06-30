import firebaseAdmin from "../helpers/Firebase";
import _RS from "../helpers/ResponseHelper";
import User from "../models/User";
import { Translate } from "../helpers/Translate"

class NotificationService {
  async sendNotification({ user, title, local, message, deviceToken, notifyType, docId, userpic = "", remote_like = 'no'}) {
    try {
      // Get To User ID Token.      
      if (deviceToken) {
        console.log('deviceToken', deviceToken, docId);
        const payload = {
          notification: {
            title: await Translate(local, title),
            body: await Translate(local, message),
          },
          token: deviceToken,
          data: {
            type: notifyType,
            id: docId.toString(),
            userpic: userpic,
            remote_like: remote_like
          },
        };
        firebaseAdmin
          .messaging()
          .send(payload)
          .then((response) => {
            console.log("Notification sent successfully : ", response);
          });
      }
    } catch (error) {
      console.log("Error while sending notification : ", error);
      return error;
    }
  }
}

export default new NotificationService();
