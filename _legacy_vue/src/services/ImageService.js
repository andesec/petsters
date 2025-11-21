class ImageService {
    static getImageURLForPokemon(id) {
        return `/assets/mon/nor/${id}.svg`;
    }

    static getImageURLForGymMaster(name) {
        return `/assets/gym/leader/${name}.png`;
    }

    static getImageURLForGymMedal(name) {
        return `/assets/gym/medal/${name}.png`;
    }
}

export default ImageService;