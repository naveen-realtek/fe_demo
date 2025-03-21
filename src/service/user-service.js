import axios from "axios";

export class AuthorizationService {
  constructor(urlPrefix = "/auth") {
    this.urlPrefix = urlPrefix;
  }

  async getUsers(role_id) {
    const response = await axios.get(
      `${this.urlPrefix}/get-users?roleId=${role_id}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async getAllUsers(offset, limit, searchQuery = "") {
    const response = await axios.get(
      `${this.urlPrefix}/get-all-users?offset=${offset}&limit=${limit}&searchQuery=${searchQuery}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async getUserDetailedView(userId) {
    const response = await axios.get(
      `${this.urlPrefix}/get-detailed-view?userId=${userId}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async getRoleList() {
    const response = await axios.get(`${this.urlPrefix}/roles-list`);
    if (response.status === 200) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async createUser(formData) {
    const response = await axios.post(
      `${this.urlPrefix}/create-user`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 201 || response.status === 202) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async updateUser(userId, formData) {
    const response = await axios.put(
      `${this.urlPrefix}/update-user?userId=${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async getAllTeams(teamId) {
    try {
      const response = await axios.get(
        `${this.urlPrefix}/get-teams${teamId ? `?teamId=${teamId}` : ""}`
      );

      if (response.status === 200) {
        return response.data;
      } else {
        return { items: [] };
      }
    } catch (error) {
      console.error("Error retrieving teams:", error);
      return { message: "Error retrieving teams", error: error.response?.data };
    }
  }

  async addTeam(teamData) {
    try {
      const response = await axios.post(
        `${this.urlPrefix}/team/create`,
        teamData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        return { message: "Failed to create team" };
      }
    } catch (error) {
      console.error("Error creating team:", error);
      return { message: "Error creating team", error: error.response?.data };
    }
  }

  async getTeamLeaders(reportingId) {
    const response = await axios.get(`${this.urlPrefix}/get-team-leaders`, {
      params: { reportingId },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async getReportingTeamMates(reportingId) {
    try {
      const response = await axios.get(
        `${this.urlPrefix}/get-reporting-team-mates`,
        {
          params: { reportingId },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        return { message: "Failed to retrieve reporting team members" };
      }
    } catch (error) {
      console.error("Error retrieving reporting team members:", error);
      return {
        message: "Error retrieving reporting team members",
        error: error.response?.data,
      };
    }
  }

  async getAllTeams(offset, limit, teamId) {
    try {
      const queryParams = new URLSearchParams({ offset, limit });

      if (teamId) {
        queryParams.append("teamId", teamId);
      }

      const response = await axios.get(
        `${this.urlPrefix}/get-teams?${queryParams.toString()}`
      );

      if (response.status === 200) {
        return response.data.data;
      } else {
        return { items: [], total: 0 };
      }
    } catch (error) {
      console.error("Error retrieving teams:", error);
      return { message: "Error retrieving teams", error: error.response?.data };
    }
  }

  async addTeam(teamData) {
    try {
      const response = await axios.post(
        `${this.urlPrefix}/team/create`,
        teamData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        return { message: "Failed to create team" };
      }
    } catch (error) {
      console.error("Error creating team:", error);
      return { message: "Error creating team", error: error.response?.data };
    }
  }

  async getTeamLeaders(reportingId) {
    const response = await axios.get(`${this.urlPrefix}/get-team-leaders`, {
      params: { reportingId },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async getReportingTeamMates(reportingId) {
    try {
      const response = await axios.get(
        `${this.urlPrefix}/get-reporting-team-mates`,
        {
          params: { reportingId },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        return { message: "Failed to retrieve reporting team members" };
      }
    } catch (error) {
      console.error("Error retrieving reporting team members:", error);
      return {
        message: "Error retrieving reporting team members",
        error: error.response?.data,
      };
    }
  }

  async updateTeam(teamId, teamData) {
    try {
      const response = await axios.post(
        `${this.urlPrefix}/team/edit?teamId=${teamId}`,
        teamData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        return { status: false, message: "Failed to update team" };
      }
    } catch (error) {
      console.error("Error updating team:", error);
      return { status: false, message: "An unexpected error occurred" };
    }
  }

  async getTeamDetailedView(teamId) {
    const response = await axios.get(
      `${this.urlPrefix}/get-team-detailed-view?teamId=${teamId}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async createcompany() {
    const response = await axios.get(`${this.urlPrefix}/get-company-details`);
    if (response.status === 200) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async createcompanyDetail() {
    const response = await axios.get(`${this.urlPrefix}/get-company-details`);
    if (response.status === 200) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async updatecompany(FormData, companyId) {
    try {
      const response = await axios.post(
        `${this.urlPrefix}/edit-company?companyid=${companyId}`,
        FormData
      );
      if (response && response.status === 200) {
        return {
          status: true,
          data: response.data,
        };
      } else {
        return {
          status: false,
          error: "Failed to update company",
        };
      }
    } catch (error) {
      console.error("Error during API request:", error);
      return {
        status: false,
        error: error.message || "An unexpected error occurred",
      };
    }
  }
  async getCompanyPhotoView(companyPhoto) {
    const response = await axios.get(
      `${this.urlPrefix}/view-profile?path=${companyPhoto}`
    );
    if (response.status == 200) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async getlocationview(offset, limit, sortBy, search = "") {
    try {
      const response = await axios.get(
        `${
          this.urlPrefix
        }/get-all-locations?offset=${offset}&limit=${limit}&sortBy=${sortBy}&search=${encodeURIComponent(
          search
        )}`
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

  async addlocation(clientAddFormData) {
    try {
      const response = await axios.post(
        `${this.urlPrefix}/create-location`,
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

  async getlocationview(offset, limit, sortBy) {
    try {
      const response = await axios.get(
        `${this.urlPrefix}/get-all-locations?offset=${offset}&limit=${limit}&sortBy=${sortBy}`
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

  async updatelocation(id, clientAddFormData) {
    try {
      const response = await axios.put(
        `${this.urlPrefix}/update-location?locationid=${id}`,
        clientAddFormData
      );
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
}
