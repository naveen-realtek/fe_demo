import React, { useEffect, useState } from "react";
import { Drawer, Button, Divider, Spin, notification } from "antd";
import { Link } from "react-router-dom";
import TeamMembersList from "./TeamMembersList";
import { authorizationService } from "../../../service";

const TeamDetailDrawer = ({ open, onClose, teamId }) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && teamId) {
      fetchTeamDetails();
    }
  }, [open, teamId]);

  const fetchTeamDetails = async () => {
    setLoading(true);
    try {
      const response = await authorizationService.getTeamDetailedView(teamId);
      if (response?.status) {
        setTeam(response.data);
      } else {
        console.error("Failed to fetch team details", response);
        notification.error({ message: "Failed to fetch team details" });
        setTeam(null);
      }
    } catch (error) {
      console.error("Error fetching team details:", error);
      notification.error({ message: "Error fetching team details" });
      setTeam(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title={
        <div className="d-flex justify-content-between align-items-center w-100">
          <span></span>
          {team && (
            <Link to={`/app/admin/usersettings/teams/edit/${team.teamId}`}>
              <Button className="zn-fw-500 zn-fs-s" size="small" type="primary">
                Edit
              </Button>
            </Link>
          )}
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      className="drawer-main"
      headerStyle={{ borderBottom: "none" }}
    >
      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : team ? (
        <>
          <p className="team-name-title-detailview pl-2 paddding-left">
            {team.teamName}
          </p>
          <p className="members-count paddding-left">
            <strong>No of Members:</strong> {team.noOfTeamMembers}
          </p>
          <p className="date-created-on paddding-left">
            <strong className="created-on">Created On:</strong>{" "}
            {new Date(team.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <Divider className="diviver-names" />
          <p className="paddding-left">
            <strong className="reporting-manager-heading">
              Reporting Manager
            </strong>{" "}
            <div className="reporting-manager-name">
              {team.reportingManager}
            </div>
          </p>
          <Divider />
          <p className="paddding-left">
            <strong className="member-heading">Members</strong>
          </p>
          <div className="paddding-left">
            <TeamMembersList members={team.teamMembers} />
          </div>
        </>
      ) : (
        <p className="paddding-left">No team details available.</p>
      )}
    </Drawer>
  );
};

export default TeamDetailDrawer;