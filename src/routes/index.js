import React from 'react';
import {
    Routes,
    Route,
} from "react-router-dom";
import { Admin } from '../pages';
import { Tagify } from '../pages/tagify';
import { UserSettingsUser } from '../pages/user-settings/user/user';
import UserSettingAdd from '../components/user-settings/add/add';
import { OrgSetompanyInformation } from '../pages/organization-settings/company-information/company-information';
import { OrgSetompanyInformationEdit } from '../pages/organization-settings/company-information/edit';
import { AdminClient } from '../pages/client/client';
import { AdminClientAdd } from '../pages/client/client-add';
import { MasterJobSources } from "../pages/master/jobs/sources/sources"
import { MasterJobRemoteStatus } from '../pages/master/jobs/remote-status/remote-status';
import { MasterJobEmploymentType } from '../pages/master/jobs/employment-type/employment-type';
import { OrgSetLocation } from '../pages/organization-settings/location/location';
import { OrgSetLocationAdd } from '../pages/organization-settings/location/add';
import { UserSettingsTeam } from '../pages/user-settings/team/team';
import { UserSettingsTeamAdd } from '../pages/user-settings/team/team-add';
import { UserSettingsRoles } from '../pages/user-settings/role/roles';
import { UserSettingsRolesAdd } from '../pages/user-settings/role/roles-add';
import { UserSettingsRolesView } from '../pages/user-settings/role/roles-view';
import { UserSettingsLimit } from '../pages/user-settings/limit/limit';
import { MasterJobTags } from '../pages/master/jobs/tags/tags';
import { MasterJobTaxTerms } from '../pages/master/jobs/tax-terms/tax-terms';
import { MasterCandidateSources } from '../pages/master/candidates/sources/sources';
import { MasterCandidateStatus } from '../pages/master/candidates/status/status';
import { MasterCandidateRejectionReason } from '../pages/master/candidates/rejection-reasons/rejection-reasons';
import { MasterCandidateResponseType } from '../pages/master/candidates/response-type/response-type';
import { MasterCandidateSkills } from '../pages/master/candidates/skills/skills';
import { MasterCandidateDomain } from '../pages/master/candidates/domain/domain';
import { MasterCandidateBlacklistTypes } from '../pages/master/candidates/blacklist-types/blacklist-types';
import { MasterCandidateRating } from '../pages/master/candidates/rating/rating';
import { MasterCandidateWorkAuthorization } from '../pages/master/candidates/work-authorization/work-authorization';
import { MasterCandidatGroups } from '../pages/master/candidates/groups/groups';
import { MasterCandidateTags } from '../pages/master/candidates/tags/tags';
import { MasterSubmissions } from '../pages/master/submissions/submissions';

export const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="*" element={<Admin />} />
            <Route path="/company-information" element={<OrgSetompanyInformation />} />
            <Route path="/company-information/edit" element={<OrgSetompanyInformationEdit />} />
            <Route path="/location" element={<OrgSetLocation />} />
            <Route path="/location/add" element={<OrgSetLocationAdd />} />
            <Route path="/location/edit/:id" element={<OrgSetLocationAdd />} />

            <Route path="/usersettings/user" element={<UserSettingsUser />} />
            <Route path="/usersettings/user/add" element={<UserSettingAdd />} />
            <Route path="/usersettings/user/edit/:id" element={<UserSettingAdd />} />
            <Route path="/clients" element={<AdminClient />} />
            <Route path="/clients/add" element={<AdminClientAdd />} />
            <Route path="/clients/edit/:id" element={<AdminClientAdd />} />
            <Route path="/jobs/sources" element={<MasterJobSources />} />
            <Route path="/jobs/remote-status" element={<MasterJobRemoteStatus />} />
            <Route path="/jobs/employment-type" element={<MasterJobEmploymentType />} />
            <Route path="/usersettings/teams" element={<UserSettingsTeam />} />
            <Route path="/usersettings/teams/add" element={<UserSettingsTeamAdd />} />
            <Route path="/usersettings/teams/edit/:id" element={<UserSettingsTeamAdd />} />
            <Route path="/usersettings/roles" element={<UserSettingsRoles />} />
            <Route path="/usersettings/roles/add" element={<UserSettingsRolesAdd />} />
            <Route path="/usersettings/roles/admin" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/manager" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/lead-recruiter" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/recruiter" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/manager" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/lead-recruiter" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/recruiter" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/talent-acquisition-executive" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/management" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/senior-recruiter" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/user-limits" element={<UserSettingsLimit />} />
            <Route path="/jobs/tags" element={<MasterJobTags />} />
            <Route path="/jobs/tax-terms" element={<MasterJobTaxTerms />} />
            <Route path="/candidates/sources" element={<MasterCandidateSources />} />
            <Route path="/candidates/status" element={<MasterCandidateStatus />} />
            <Route path="/candidates/rejection-reasons" element={<MasterCandidateRejectionReason />} />
            <Route path="/candidates/response-type" element={<MasterCandidateResponseType />} />
            <Route path="/candidates/skills" element={<MasterCandidateSkills />} />
            <Route path="/candidates/domain" element={<MasterCandidateDomain />} />
            <Route path="/candidates/blacklist-type" element={<MasterCandidateBlacklistTypes />} />
            <Route path="/candidates/rating" element={<MasterCandidateRating />} />
            <Route path="/candidates/work-authorization" element={<MasterCandidateWorkAuthorization />} />
            <Route path="/candidates/groups" element={<MasterCandidatGroups />} />
            <Route path="/candidates/tags" element={<MasterCandidateTags />} />
            <Route path="/submissions/status" element={<MasterSubmissions />} />
            {/* <Route path="/candidates/skills" element={<MasterCandidateSkills />} />
            <Route path="/candidates/domain" element={<MasterCandidateDomain />} />
            <Route path="/candidates/blacklist-types" element={<MasterCandidateBlacklistTypes />} />
            <Route path="/candidates/rating" element={<MasterCandidateRating />} />
            <Route path="/candidates/work-authorization" element={<MasterCandidateWorkAuthorization />} />
            <Route path="/candidates/groups" element={<MasterCandidatGroups />} />
            <Route path="/candidates/tags" element={<MasterCandidateTags />} /> */}
            {/*<Route path="/jobs/tags" element={<MasterJobTags />} />
            <Route path="/jobs/tax-terms" element={<MasterJobTaxTerms />} /> */}
            {/* <Route path="/usersettings/users/edit" element={<UserSettingsAddUser />} />
            <Route path="/usersettings/users/invite" element={<UserSettingsInvite />} />
            <Route path="/usersettings/teams" element={<UserSettingsTeam />} />
            <Route path="/usersettings/teams/add" element={<UserSettingsTeamAdd />} />
            <Route path="/usersettings/user-limits" element={<UserSettingsLimit />} />
            <Route path="/usersettings/roles" element={<UserSettingsRoles />} />
            <Route path="/usersettings/roles/add" element={<UserSettingsRolesAdd />} />
            <Route path="/usersettings/roles/admin" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/manager" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/lead-recruiter" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/recruiter" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/talent-acquisition-executive" element={<UserSettingsRolesView />} />
            <Route path="/usersettings/roles/management" element={<UserSettingsRolesView />} /> */}
            <Route path="/tagify" element={<Tagify />} />
        </Routes>
    )
}