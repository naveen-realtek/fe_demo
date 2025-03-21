import axios from "axios";

export class RoleService {
  constructor(urlPrefix = "/authapi/v1") {
    // Updated prefix
    this.urlPrefix = urlPrefix;
  }

  async getRoles() {
    try {
      const response = await axios.get(`${this.urlPrefix}/get-roles`);
      if (response.status === 200 && response.data.status) {
        return {
          zinnext_default: response.data.data.zinnext_default || [],
          custom_roles: response.data.data.custom_roles || [],
        };
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
    return { zinnext_default: [], custom_roles: [] };
  }

  async getRoleDetails(roleId) {
    try {
      const response = await axios.get(
        `${this.urlPrefix}/get-role-details?roleid=${roleId}`
      );

      console.log("Full API Response:", response.data);

      if (response.status === 200 && response.data.status) {
        return response.data.data;
      }
    } catch (error) {
      console.error(`Error fetching details for role ${roleId}:`, error);
    }
    return null;
  }

  async getRoleList() {
    const response = await axios.get(
      `${this.urlPrefix}/get-role-permission-list`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async addCustomRole(teamData) {
    try {
      const response = await axios.post(
        `${this.urlPrefix}/add-custom-role`,
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
        return { message: "Failed to add custom role" };
      }
    } catch (error) {
      console.error("Error creating role:", error);
      return { message: "Error creating role", error: error.response?.data };
    }
  }

  async deleteRole(roleId, roleData) {
    try {
      const response = await axios.put(
        `${this.urlPrefix}/delete-roles`,
        roleData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.status === 200 ? response.data : { status: false };
    } catch (error) {
      console.error("Error deleting role:", error);
      return { status: false };
    }
  }

  async getEditRoleList(roleId) {
    const response = await axios.get(
      `${this.urlPrefix}/edit-get-role?roleid=${roleId}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return { items: [] };
    }
  }

  async editCustomRole(payload) {
    // ✅ Accepts full payload
    try {
      const response = await axios.put(
        `${this.urlPrefix}/edit-role-details`,
        payload, // ✅ Send full JSON payload
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        return { message: "Failed to edit custom role" };
      }
    } catch (error) {
      console.error("Error editing role:", error);
      return { message: "Error editing role", error: error.response?.data };
    }
  }
}
