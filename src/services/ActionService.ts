import ApiService from './ApiService';
import UXService from './UXService';

export default class ActionService {

    static async loadActionInfo(actionId: string | number) {
        try {
            return await ApiService.makeRequest("/action/" + actionId);
        } catch (error) {
            UXService.error("An error occurred while loading data.", error);
        }
    }

    static async searchActionInfo(action: string) {
        try {
            return await ApiService.makeRequest("/action/search/" + action);
        } catch (error) {
            UXService.error("An error occurred while searching.", error);
        }
    }
}
