import ApiService from './ApiService';
import UXService from "@/services/UXService.js";

export default class PetsterService {

    /**
     * Fetches the current party details from the server.
     * Makes an API request to retrieve the information about the current party,
     * and returns the relevant data if the request is successful.
     *
     * @return {Promise<any>} A promise that resolves to the current party details, or undefined if an error occurs.
     */
    static async fetchCurrentParty() {
        try {
            const response = await ApiService.makeRequest("/party");
            return response.p;
        } catch (error) {
            console.error("Error fetching party:", error);
        }
    }

    static async saveCurrentParty(updatedSequence) {
        try {
            const response = await ApiService.makeRequest("/party", "POST", {p: updatedSequence});
            UXService.notify(response.message)
        } catch (error) {
            UXService.error("An error occurred while saving your party.", error)
        }
    }

    static async loadPetInfo(petId) {
        try {
            const response = await ApiService.makeRequest("/pet/" + petId);
        } catch (error) {
            UXService.error("An error occurred while saving your party.", error)
        }
    }

    static async searchPetInfo(pet) {
        try {
            const response = await ApiService.makeRequest("/pet/search/" + pet);
        } catch (error) {
            UXService.error("An error occurred while saving your party.", error)
        }
    }
}