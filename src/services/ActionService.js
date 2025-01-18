import ApiService from './ApiService';
import UXService from "@/services/UXService.js";

export default class ActionService {

    static async loadActionInfo(actionId) {
        try {
            return await ApiService.makeRequest("/action/" + actionId);
        } catch (error) {
            UXService.error("An error occurred while loading data.", error)
        }
    }

    static async searchActionInfo(action) {
        try {
            return await ApiService.makeRequest("/action/search/" + action);
        } catch (error) {
            UXService.error("An error occurred while searching.", error)
        }
    }


}