import axios from "axios";

export class ClientServices {
    constructor(urlPrefix) {
        this.urlPrefix = urlPrefix;
    }
    async addClient(clientAddFormData) {
        try {
            const response = await axios.post(
                `${this.urlPrefix}/add-client`,
                clientAddFormData
            );
            if (response && response.status == 200) {
                return response && response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error during API request:", error);
            return { items: [] };
        }
    }

    async editClient(id, clientAddFormData) {
        try {
            const response = await axios.put(`${this.urlPrefix}/edit/${id}`, clientAddFormData);
            if (response && response.status === 200) {
                return response.data;
            } else {
                return { status: false };
            }
        } catch (error) {
            console.error("Error during API request:", error);
            return { status: false };
        }
    }

    async Exportclient(payload = {}) {
        console.log("Starting export client API call with payload:", payload);
        try {
            const response = await axios.post(
                `${this.urlPrefix}/exportClients`,
                payload, // Pass the payload here
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                console.log("API response:", response.data);

                if (Array.isArray(response.data.items)) {
                    return response.data.items;
                }

                if (Array.isArray(response.data)) {
                    return response.data;
                }

                console.warn("Unexpected response format:", response.data);
                return [];
            } else {
                console.warn("Unexpected status code:", response.status);
                return [];
            }
        } catch (error) {
            console.error("Error during API request:", error);
            return [];
        }
    }

    async Inactiveclient(id, status) {
        const endpoint = `${this.urlPrefix}/inactivate/${id}?status=${status}`;
        console.log("Updating client status. Endpoint:", endpoint);

        try {
            const response = await axios.put(endpoint);
            console.log("API Response Received:", response);

            if (response && response.status === 200) {
                console.log(`Client status updated successfully to ${status}:`, response.data);
                return response.data;
            } else {
                console.warn("Unexpected response:", response);
                return { items: [] };
            }
        } catch (error) {
            console.error("Error during API request:", error);
            return { items: [] };
        }
    }

    async clientValidate(clientName) {
        try {
            const response = await axios.get(
                `${this.urlPrefix}/organization-name-validate?clientName=${clientName}`
            );
            // Check if response is successful
            if (response && response.status === 200) {
                return response.data; // Return response data
            } else {
                return { items: [] }; // Return empty items if status is not successful
            }
        } catch (error) {
            console.error("Error during API request:", error);
            return { items: [] }; // Return empty items in case of error
        }
    }


    async getAccountManagerList() {
        console.log("manager ip is--------->", `${this.urlPrefix}/manager`)
        try {
            const response = await axios.get(`${this.urlPrefix}/manager`);
            if (response && response.status == 200) {
                return response && response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error during API request:", error);
            return { items: [] };
        }
    }

    async getClientview(offset, limit, sortBy, search = "") {
        try {
            const response = await axios.get(
                `${this.urlPrefix}/view?offset=${offset}&limit=${limit}&sortBy=${sortBy}&searchValue=${search}`
            );
            if (response && response.status === 200) {
                return response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error fetching client data:", error);
            return { items: [] };
        }
    }

    async getClientDetailedview(clientId) {
        try {
            const response = await axios.get(
                `${this.urlPrefix}/quickview/${clientId}`
            );
            if (response && response.status === 200) {
                return response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error fetching client data:", error);
            return { items: [] };
        }
    }
    async getClientSearch(offset, limit, sortBy, searchValue) {
        try {
            const response = await axios.get(
                `${this.urlPrefix}/view?offset=${offset}&limit=${limit}&sortBy=${sortBy}&searchValue=${searchValue}`
            );
            if (response && response.status === 200) {
                return response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error fetching client data:", error);
            return { items: [] };
        }
    }


}
