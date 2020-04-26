import MessageController from './Data/MessageController';
import PlayerData from './Data/PlayerData';
import SceneController from './Data/SceneController';
const global = {
    messageController: new MessageController(),
    playerData: new PlayerData(),
    sceneController: new SceneController()
}
export default global;