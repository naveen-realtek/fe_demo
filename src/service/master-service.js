import axios from "axios";
import { message } from "antd"; // ✅ Import Ant Design message component

export class MasterServices {
  constructor(urlPrefix = "/mastersapi") {
    this.urlPrefix = urlPrefix;
  }



  async deleteMaster(masterName, uniqueId) {
    try {
      const response = await axios.put(
        `${this.urlPrefix}/delete?masterName=${masterName}&uniqueId=${uniqueId}`,
        {},
        {
          headers: {
            Authorization: `Bearer YOUR_ACCESS_TOKEN`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.status === 200 ? { status: true } : { status: false };
    } catch (error) {
      console.error("Error during API request:", error);
      return { status: false };
    }
  }






  async addMasters(masterName, jobsdata) {
    try {
      const response = await axios.post(
        `${this.urlPrefix}/add?masterName=${masterName}`,
        jobsdata
      );
      if (response.status === 200) {
        return response.data; // No need for double response checks
      }
      return { items: [] };
    } catch (error) {
      console.error("Error during API request:", error);
      return { items: [] };
    }
  }

  async detailMaster(masterName, id) {
    try {
      const response = await axios.get(`${this.urlPrefix}/getbyid?mastername=${masterName}&id=${id}`);
      if (response.status === 200) {
        return response.data; // No need for double response checks
      }
      return { items: [] };
    } catch (error) {
      console.error("Error during API request:", error);
      return { items: [] };
    }
  }

  async EditMasters(masterName, jobsdata) {
    try {
      const response = await axios.post(
        `${this.urlPrefix}/edit?masterName=${masterName}`,
        jobsdata
      );
      if (response.status === 200) {
        return response.data;
      }
      return { items: [] };
    } catch (error) {
      console.error("Error during API request:", error);
      return { items: [] };
    }
  }


  async getMasters(masterName, offset, limit, sortby = "new") {
    try {
      const response = await axios.get(`${this.urlPrefix}/home`, {
        params: {
          masterName,
          offset,
          limit,
          sortby, // Sorting order: "new" or "old"
        },
        headers: {
          Authorization: `Bearer ${this.accessToken}`, // Ensure `this.accessToken` holds a valid token
        },
      });

      if (response && response.status === 200) {
        return response.data; // Ensure correct response key
      }
      return { masterFeeds: [] }; // Return empty structure matching expected response
    } catch (error) {
      console.error("Error fetching master job sources:", error);
      return { masterFeeds: [] };
    }
  }


  async updateMasterFeedStatus(masterName, uniqueId, status) {
    const endpoint = `${this.urlPrefix}/status?masterName=${masterName}&uniqueId=${uniqueId}&status=${status}`;
    console.log("Updating master feed status. Endpoint:", endpoint);

    try {
      const response = await axios.post(endpoint, null, {
        headers: { Authorization: `Bearer YOUR_ACCESS_TOKEN` },
      });

      if (response && response.status === 200) {
        console.log(`Master feed status updated successfully to ${status}:`, response.data);
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


}
