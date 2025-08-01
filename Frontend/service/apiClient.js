class ApiClient {
    constructor() {
        this.baseUrl = "http://localhost:8000/api/v1";
        this.defaultHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }

    async customFetch(endpoint, options = {}) {
        try {
            const url = `${this.baseUrl}${endpoint}`;

            const headers = { ...this.defaultHeaders, ...options.headers };

            const config = {
                ...options,
                headers,
                credentials: "include"
            }

            console.log(`Fetching ${url}`)

            const response = await fetch(url, config)

            console.log('Response from fetch', response)

            const data = await response.json()

            return data

        } catch (error) {
            console.log("API Error", error);
            throw error;
        }
    }


    // auth endpoints

    async signup(name, email, password){
        return this.customFetch("/user/register", {
            method: "POST",
            body: JSON.stringify({name, email, password})
        })
    }

    async login(email, password){
        return this.customFetch("/user/login", {
            method: "POST",
            body: JSON.stringify({ email, password})
        })
    }

    async getProfile(){
        return this.customFetch("/user/me")
    }
}


const apiClient = new ApiClient()

export default apiClient