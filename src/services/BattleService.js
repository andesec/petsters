import ApiService from './ApiService';

class BattleService {
    /**
     * Initiates a battle with the trainer.
     * Calls `/battle/initiate/trainer` endpoint.
     * @param {Object} data - Data to start the battle (e.g., opponentId, team info).
     * @returns {Promise<Object>} - Response from the API.
     */
     static async initiateBattle(data) {
        try {
            return await ApiService.makeRequest('/battle/initiate/trainer', 'POST', data);
        } catch (error) {
            console.error('Error initiating battle:', error);
            throw error;
        }
    }

    /**
     * Continues the battle by sending the next action/state.
     * Calls `/battle/continue/trainer` endpoint.
     * @param {Object} data - Data for continuing battle, such as selected Pokémon or action.
     * @returns {Promise<Object>} - Response from the API.
     */
    static async continueBattle(data) {
        try {
            return await ApiService.makeRequest('/battle/continue/trainer', 'POST', data);
        } catch (error) {
            console.error('Error continuing battle:', error);
            throw error;
        }
    }


}

export default BattleService;