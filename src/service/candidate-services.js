import axios from "axios";

export class CandidateService {

    constructor(urlPrefix = "/candidates") {
        this.urlPrefix = urlPrefix;
    }

    async getCandidateQuickview(id) {
        
        const response = await axios.get(
            `${this.urlPrefix}/detailed-view?_id=${id}`
        );
        if (response.status == 201) {
            return response.data;
        } else {
            return { items: [] };
        }
    }

    async getCountry() {
        console.log("this.urlPrefixthis.urlPrefixthis.urlPrefixthis.urlPrefix",this.urlPrefix)
        try {
            const response = await axios.get(`${this.urlPrefix}/country`);
            if (response && response.status === 200) {
                return response && response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error fetching state:", error);
            return { items: [] };
        }
    }


    
    async gettimezone() {
        console.log("this.urlPrefixthis.urlPrefixthis.urlPrefixthis.urlPrefix",this.urlPrefix)
        try {
            const response = await axios.get(`${this.urlPrefix}/timezone`);
            if (response && response.status === 200) {
                return response && response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error fetching state:", error);
            return { items: [] };
        }
    }



    async getState(id) {
        try {
            const response = await axios.get(
                `${this.urlPrefix}/country/state?countryId=${id}`
            );
            if (response && response.status === 200) {
                return response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error fetching state:", error);
            return { items: [] };
        }
    }

    async getCity(countryId, stateId) {
        try {
            const response = await axios.get(
                `${this.urlPrefix}/country/state/city?countryId=${countryId}&stateId=${stateId}`
            );
            if (response && response.status == 200) {
                return response && response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error fetching state:", error);
            return { items: [] };
        }
    }


    
    async getCountrycodeList() {
        try {
            const response = await axios.get(`${this.urlPrefix}/countrycode`);
            if (response && response.status == 200) {
                return response && response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error fetching state:", error);
            return { items: [] };
        }
    }

  



    async getCandidateQuickview(id) {
        const response = await axios.get(`${this.urlPrefix}/detailed-view?_id=${id}`);
        if (response.status == 201) {
            return response.data;
        } else {
            return { items: [] };
        }
    }
    async getCountrycode() {
        try {
            const response = await axios.get(`${this.urlPrefix}/countrycode`);
            if (response && response.status == 200) {
                return response && response.data;
            } else {
                return { items: [] };
            }
        }
        catch (error) {
            console.error('Error fetching state:', error);
            return { items: [] };
        }
    }

    async getUserProfile(userProfile) {
        const response = await axios.get(`${this.urlPrefix}/document/link?path=${userProfile}`);
        if (response.status == 200) {
            return response.data;
        } else {
            return { items: [] };
        }
    }


    async getCountry() {
        try {
            const response = await axios.get(`${this.urlPrefix}/country`);
            if (response && response.status === 200) {
                return response && response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error fetching state:", error);
            return { items: [] };
        }
    }



    async gettimezone() {
        try {
            const response = await axios.get(`${this.urlPrefix}/timezone`);
            if (response && response.status === 200) {
                return response && response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error fetching state:", error);
            return { items: [] };
        }
    }



    async getState(id) {
        try {
            const response = await axios.get(
                `${this.urlPrefix}/country/state?countryId=${id}`
            );
            if (response && response.status === 200) {
                return response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error fetching state:", error);
            return { items: [] };
        }
    }

    async getCity(countryId, stateId) {
        try {
            const response = await axios.get(
                `${this.urlPrefix}/country/state/city?countryId=${countryId}&stateId=${stateId}`
            );
            if (response && response.status == 200) {
                return response && response.data;
            } else {
                return { items: [] };
            }
        } catch (error) {
            console.error("Error fetching state:", error);
            return { items: [] };
        }
    }

    async getCompanyPhoto(companyPhoto) {
        const response = await axios.get(`${this.urlPrefix}/document/link?path=${companyPhoto}`);
        if (response.status == 200) {
            return response.data;
        } else {
            return { items: [] };
        }
    }

}