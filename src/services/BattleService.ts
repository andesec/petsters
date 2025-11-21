import ApiService from './ApiService';

export default class BattleService {
    /**
     * Initiates a battle with the trainer.
     * Calls `/battle/initiate/<type>` endpoint.
     * @param type battle type
     * @param {Object} data - Data to start the battle (e.g., opponentId, team info).
     * @returns {Promise<Object>} - Response from the API.
     */
    static async initiateBattle(type: string, data: any) {
        try {
            console.log('Initiating battle with trainer...');
            return await ApiService.makeRequest('/battle/initiate/' + type, 'POST', data);
        } catch (error) {
            console.error('Error initiating battle:', error);
            throw error;
        }
    }

    /**
     * Continues the battle by sending the next action/state.
     * Calls `/battle/continue/<type>` endpoint.
     * @param type battle type
     * @param {Object} data - Data for continuing battle, such as selected Pokémon or action.
     * @returns {Promise<Object>} - Response from the API.
     */
    static async continueBattle(type: string, data: any) {
        try {
            console.log('Continuing battle...');
            console.log(data);
            return await ApiService.makeRequest('/battle/continue/' + type, 'POST', data);
        } catch (error) {
            console.error('Error continuing battle:', error);
            throw error;
        }
    }
}
