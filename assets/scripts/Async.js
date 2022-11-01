class Async {
    getFromAsync = async (ressource) => {
        try {
            let response = await fetch(ressource);
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                console.log(contentType);
                if (contentType && contentType.indexOf("application/json") != -1) {
                    return response.json();
                } else {
                    return response.text();
                }
            } else {
                throw new Error('la reponse n\'est pas ok');
            }
        } catch (error) {
            return error.message;
        }
    }
}

export const {getFromAsync} = new Async();